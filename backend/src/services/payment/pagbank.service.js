import axios from 'axios';
import logger from '../../utils/logger.js';
import { prisma } from '../../config/database.js';

class PagBankService {
  constructor() {
    this.apiUrl = process.env.PAGBANK_SANDBOX === 'true'
      ? 'https://sandbox.api.pagseguro.com'
      : 'https://api.pagseguro.com';

    this.token = process.env.PAGBANK_SANDBOX === 'true'
      ? process.env.PAGBANK_TOKEN_SANDBOX
      : process.env.PAGBANK_TOKEN;

    logger.info('PagBank Service initialized', {
      mode: process.env.PAGBANK_SANDBOX === 'true' ? 'sandbox' : 'production',
      apiUrl: this.apiUrl
    });
  }

  /**
   * Criar pagamento com cartão de crédito
   */
  async createCardPayment(order, cardData) {
    try {
      logger.info('Creating card payment', { orderId: order.id });

      // Obter dados do comprador (user ou guest checkout)
      const customerName = order.user?.name || order.customerName;
      const customerEmail = order.user?.email || order.customerEmail;
      const customerCpf = order.user?.cpf || order.customerCpf;
      const customerPhone = order.user?.phone || order.customerPhone;

      const payload = {
        reference_id: order.orderNumber,
        customer: {
          name: customerName,
          email: customerEmail,
          tax_id: customerCpf?.replace(/\D/g, '') || '00000000000',
          phones: [{
            country: '55',
            area: customerPhone?.substring(0, 2) || '11',
            number: customerPhone?.substring(2) || '999999999',
            type: 'MOBILE'
          }]
        },
        items: order.items.map(item => ({
          reference_id: item.productId,
          name: item.productName.substring(0, 64), // Max 64 chars
          quantity: item.quantity,
          unit_amount: Math.round(item.price * 100) // Em centavos
        })),
        shipping: {
          address: {
            street: order.shippingAddress.street,
            number: order.shippingAddress.number,
            complement: order.shippingAddress.complement || '',
            locality: order.shippingAddress.neighborhood,
            city: order.shippingAddress.city,
            region_code: order.shippingAddress.state,
            country: 'BRA',
            postal_code: order.shippingAddress.zipCode.replace(/\D/g, '')
          }
        },
        charges: [{
          reference_id: order.orderNumber,
          description: `Pedido #${order.orderNumber}`,
          amount: {
            value: Math.round(order.total * 100), // Em centavos
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: cardData.installments || 1,
            capture: true,
            card: {
              number: cardData.number.replace(/\s/g, ''),
              exp_month: cardData.expMonth,
              exp_year: cardData.expYear,
              security_code: cardData.cvv,
              holder: {
                name: cardData.holderName
              }
            }
          }
        }],
        notification_urls: [
          `${process.env.BACKEND_URL}/api/payment/webhook/pagbank`
        ]
      };

      // Log da requisição (sem dados sensíveis)
      const logPayload = { ...payload };
      if (logPayload.charges[0].payment_method.card) {
        logPayload.charges[0].payment_method.card = {
          ...logPayload.charges[0].payment_method.card,
          number: '****',
          security_code: '***'
        };
      }
      await this.logPayment(order.id, 'pagbank', 'credit_card', 'created', logPayload);

      const response = await axios.post(
        `${this.apiUrl}/orders`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Log da resposta
      await this.logPayment(order.id, 'pagbank', 'credit_card', 'success', null, response.data);

      const charge = response.data.charges[0];

      const result = {
        orderId: response.data.id,
        chargeId: charge.id,
        status: charge.status,
        paymentId: charge.id,
        amount: charge.amount.value / 100,
        approved: charge.status === 'PAID',
        authorizationCode: charge.payment_response?.code,
        nsu: charge.payment_response?.reference,
        gateway: 'pagbank',
        method: 'credit_card',
        installments: cardData.installments || 1
      };

      logger.info('Card payment created successfully', {
        orderId: order.id,
        pbOrderId: result.orderId,
        status: result.status
      });

      return result;

    } catch (error) {
      const errorMessage = error.response?.data?.error_messages?.[0]?.description || error.message;
      
      logger.error('Error creating card payment', {
        orderId: order.id,
        error: errorMessage
      });

      await this.logPayment(
        order.id,
        'pagbank',
        'credit_card',
        'error',
        null,
        error.response?.data,
        errorMessage
      );

      throw new Error(`PagBank Error: ${errorMessage}`);
    }
  }

  /**
   * Verificar status do pagamento
   */
  async checkPaymentStatus(pbOrderId) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/orders/${pbOrderId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }
      );

      const charge = response.data.charges[0];

      return {
        status: charge.status,
        approved: charge.status === 'PAID',
        amount: charge.amount.value / 100,
        metadata: {
          order_number: response.data.reference_id
        }
      };
    } catch (error) {
      logger.error('Error checking PagBank status', {
        pbOrderId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Processar webhook do PagBank
   */
  async processWebhook(data) {
    try {
      logger.info('Processing PagBank webhook', { data });

      // Salvar webhook no banco
      await prisma.webhookLog.create({
        data: {
          source: 'pagbank',
          event: data.charges?.[0]?.status || 'unknown',
          payload: data,
          processed: false
        }
      });

      const pbOrderId = data.id;
      const paymentInfo = await this.checkPaymentStatus(pbOrderId);

      // Buscar pedido
      const order = await prisma.order.findFirst({
        where: { pbOrderId }
      });

      if (!order) {
        logger.warn('Order not found for PagBank payment', { pbOrderId });
        return null;
      }

      // Atualizar status do pedido
      const newStatus = this.mapPaymentStatus(data.charges[0].status);

      await prisma.order.update({
        where: { id: order.id },
        data: {
          pbStatus: data.charges[0].status,
          paymentStatus: newStatus.paymentStatus,
          status: newStatus.orderStatus,
          paymentData: paymentInfo
        }
      });

      // Log do processamento
      await this.logPayment(
        order.id,
        'pagbank',
        'webhook',
        'processed',
        null,
        paymentInfo
      );

      // Marcar webhook como processado
      await prisma.webhookLog.updateMany({
        where: {
          source: 'pagbank',
          payload: { path: ['id'], equals: pbOrderId }
        },
        data: { processed: true }
      });

      logger.info('PagBank webhook processed successfully', {
        orderId: order.id,
        paymentStatus: newStatus.paymentStatus
      });

      return {
        orderId: order.id,
        status: data.charges[0].status,
        approved: paymentInfo.approved
      };

    } catch (error) {
      logger.error('Error processing PagBank webhook', {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Mapear status do PagBank para status do sistema
   */
  mapPaymentStatus(pbStatus) {
    const statusMap = {
      'PAID': {
        paymentStatus: 'APPROVED',
        orderStatus: 'CONFIRMED'
      },
      'IN_ANALYSIS': {
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING'
      },
      'DECLINED': {
        paymentStatus: 'REJECTED',
        orderStatus: 'CANCELLED'
      },
      'CANCELED': {
        paymentStatus: 'CANCELLED',
        orderStatus: 'CANCELLED'
      }
    };

    return statusMap[pbStatus] || {
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING'
    };
  }

  /**
   * Calcular parcelas disponíveis
   */
  calculateInstallments(amount, maxInstallments = 12) {
    const installments = [];

    for (let i = 1; i <= maxInstallments; i++) {
      const installmentAmount = amount / i;

      // Não oferecer parcelas menores que R$ 5
      if (installmentAmount < 5) break;

      installments.push({
        quantity: i,
        installmentAmount: Number(installmentAmount.toFixed(2)),
        totalAmount: Number(amount.toFixed(2)),
        interestFree: i <= 3, // Até 3x sem juros
        label: i === 1
          ? `À vista - R$ ${amount.toFixed(2).replace('.', ',')}`
          : `${i}x de R$ ${installmentAmount.toFixed(2).replace('.', ',')} ${i <= 3 ? 'sem juros' : ''}`
      });
    }

    return installments;
  }

  /**
   * Salvar log de pagamento no banco
   */
  async logPayment(orderId, gateway, method, event, request = null, response = null, errorMessage = null) {
    try {
      await prisma.paymentLog.create({
        data: {
          orderId,
          gateway,
          method,
          event,
          status: response?.status || 'pending',
          request: request || {},
          response: response || {},
          errorMessage
        }
      });
    } catch (error) {
      logger.error('Error saving payment log', { error: error.message });
    }
  }
}

export default PagBankService;
