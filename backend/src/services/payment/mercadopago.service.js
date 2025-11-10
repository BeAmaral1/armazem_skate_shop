import mercadopago from 'mercadopago';
import logger from '../../utils/logger.js';
import { prisma } from '../../config/database.js';

class MercadoPagoService {
  constructor() {
    const accessToken = process.env.MP_MODE === 'production'
      ? process.env.MP_ACCESS_TOKEN
      : process.env.MP_ACCESS_TOKEN_SANDBOX;

    mercadopago.configure({
      access_token: accessToken
    });

    logger.info('MercadoPago Service initialized', {
      mode: process.env.MP_MODE
    });
  }

  /**
   * Criar pagamento PIX
   */
  async createPixPayment(order) {
    try {
      logger.info('Creating PIX payment', { orderId: order.id });

      // Obter dados do comprador (user ou guest checkout)
      const customerName = order.user?.name || order.customerName;
      const customerEmail = order.user?.email || order.customerEmail;
      const customerCpf = order.user?.cpf || order.customerCpf;

      const payment = {
        transaction_amount: order.total,
        description: `Pedido #${order.orderNumber} - Armazém Skate Shop`,
        payment_method_id: 'pix',
        payer: {
          email: customerEmail,
          first_name: customerName.split(' ')[0],
          last_name: customerName.split(' ').slice(1).join(' ') || 'Sobrenome',
          identification: {
            type: 'CPF',
            number: customerCpf?.replace(/\D/g, '') || '00000000000'
          }
        },
        notification_url: `${process.env.BACKEND_URL}/api/payment/webhook/mercadopago`,
        metadata: {
          order_id: order.id,
          order_number: order.orderNumber
        }
      };

      // Log da requisição
      await this.logPayment(order.id, 'mercadopago', 'pix', 'created', payment);

      const response = await mercadopago.payment.create(payment);

      // Log da resposta
      await this.logPayment(order.id, 'mercadopago', 'pix', 'success', null, response.body);

      const result = {
        paymentId: response.body.id,
        qrCode: response.body.point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: response.body.point_of_interaction.transaction_data.qr_code_base64,
        ticketUrl: response.body.point_of_interaction.transaction_data.ticket_url,
        expirationDate: response.body.date_of_expiration,
        status: response.body.status,
        gateway: 'mercadopago',
        method: 'pix'
      };

      logger.info('PIX payment created successfully', {
        orderId: order.id,
        paymentId: result.paymentId
      });

      return result;

    } catch (error) {
      logger.error('Error creating PIX payment', {
        orderId: order.id,
        error: error.message
      });

      await this.logPayment(order.id, 'mercadopago', 'pix', 'error', null, null, error.message);
      throw error;
    }
  }

  /**
   * Criar pagamento com Boleto
   */
  async createBoletoPayment(order) {
    try {
      logger.info('Creating Boleto payment', { orderId: order.id });

      // Obter dados do comprador (user ou guest checkout)
      const customerName = order.user?.name || order.customerName;
      const customerEmail = order.user?.email || order.customerEmail;
      const customerCpf = order.user?.cpf || order.customerCpf;

      const payment = {
        transaction_amount: order.total,
        description: `Pedido #${order.orderNumber} - Armazém Skate Shop`,
        payment_method_id: 'bolbradesco',
        payer: {
          email: customerEmail,
          first_name: customerName.split(' ')[0],
          last_name: customerName.split(' ').slice(1).join(' ') || 'Sobrenome',
          identification: {
            type: 'CPF',
            number: customerCpf?.replace(/\D/g, '') || '00000000000'
          },
          address: {
            zip_code: order.shippingAddress.zipCode.replace(/\D/g, ''),
            street_name: order.shippingAddress.street,
            street_number: order.shippingAddress.number,
            neighborhood: order.shippingAddress.neighborhood,
            city: order.shippingAddress.city,
            federal_unit: order.shippingAddress.state
          }
        },
        notification_url: `${process.env.BACKEND_URL}/api/payment/webhook/mercadopago`,
        metadata: {
          order_id: order.id,
          order_number: order.orderNumber
        }
      };

      await this.logPayment(order.id, 'mercadopago', 'boleto', 'created', payment);

      const response = await mercadopago.payment.create(payment);

      await this.logPayment(order.id, 'mercadopago', 'boleto', 'success', null, response.body);

      const result = {
        paymentId: response.body.id,
        boletoUrl: response.body.transaction_details.external_resource_url,
        barcode: response.body.barcode?.content,
        dueDate: response.body.date_of_expiration,
        status: response.body.status,
        gateway: 'mercadopago',
        method: 'boleto'
      };

      logger.info('Boleto payment created successfully', {
        orderId: order.id,
        paymentId: result.paymentId
      });

      return result;

    } catch (error) {
      logger.error('Error creating Boleto payment', {
        orderId: order.id,
        error: error.message
      });

      await this.logPayment(order.id, 'mercadopago', 'boleto', 'error', null, null, error.message);
      throw error;
    }
  }

  /**
   * Verificar status do pagamento
   */
  async checkPaymentStatus(paymentId) {
    try {
      const payment = await mercadopago.payment.get(paymentId);

      return {
        status: payment.body.status,
        statusDetail: payment.body.status_detail,
        approved: payment.body.status === 'approved',
        metadata: payment.body.metadata
      };
    } catch (error) {
      logger.error('Error checking payment status', {
        paymentId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Processar webhook do Mercado Pago
   */
  async processWebhook(data) {
    try {
      logger.info('Processing MercadoPago webhook', { data });

      // Salvar webhook no banco
      await prisma.webhookLog.create({
        data: {
          source: 'mercadopago',
          event: data.type || 'unknown',
          payload: data,
          processed: false
        }
      });

      if (data.type === 'payment') {
        const paymentId = data.data.id;
        const paymentInfo = await this.checkPaymentStatus(paymentId);

        // Buscar pedido
        const order = await prisma.order.findFirst({
          where: { mpPaymentId: String(paymentId) }
        });

        if (!order) {
          logger.warn('Order not found for payment', { paymentId });
          return null;
        }

        // Atualizar status do pedido
        const newStatus = this.mapPaymentStatus(paymentInfo.status);
        
        await prisma.order.update({
          where: { id: order.id },
          data: {
            mpStatus: paymentInfo.status,
            paymentStatus: newStatus.paymentStatus,
            status: newStatus.orderStatus,
            paymentData: paymentInfo
          }
        });

        // Log do processamento
        await this.logPayment(
          order.id,
          'mercadopago',
          'webhook',
          'processed',
          null,
          paymentInfo
        );

        // Marcar webhook como processado
        await prisma.webhookLog.updateMany({
          where: {
            source: 'mercadopago',
            payload: { path: ['data', 'id'], equals: paymentId }
          },
          data: { processed: true }
        });

        logger.info('Webhook processed successfully', {
          orderId: order.id,
          paymentStatus: newStatus.paymentStatus
        });

        return {
          orderId: order.id,
          status: paymentInfo.status,
          approved: paymentInfo.approved
        };
      }

      return null;

    } catch (error) {
      logger.error('Error processing webhook', { error: error.message });
      throw error;
    }
  }

  /**
   * Mapear status do MercadoPago para status do sistema
   */
  mapPaymentStatus(mpStatus) {
    const statusMap = {
      'approved': {
        paymentStatus: 'APPROVED',
        orderStatus: 'CONFIRMED'
      },
      'pending': {
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING'
      },
      'in_process': {
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING'
      },
      'rejected': {
        paymentStatus: 'REJECTED',
        orderStatus: 'CANCELLED'
      },
      'cancelled': {
        paymentStatus: 'CANCELLED',
        orderStatus: 'CANCELLED'
      },
      'refunded': {
        paymentStatus: 'REFUNDED',
        orderStatus: 'REFUNDED'
      }
    };

    return statusMap[mpStatus] || {
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING'
    };
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

export default MercadoPagoService;
