import PaymentFactory from '../services/payment/payment.factory.js';
import { prisma } from '../config/database.js';
import logger from '../utils/logger.js';

class PaymentController {
  /**
   * Criar novo pagamento
   */
  async createPayment(req, res) {
    try {
      const { orderId, paymentMethod, cardData } = req.body;

      logger.info('Creating payment', { orderId, paymentMethod });

      // Validar dados
      if (!orderId || !paymentMethod) {
        return res.status(400).json({
          success: false,
          error: 'orderId e paymentMethod são obrigatórios'
        });
      }

      // Validar dados do cartão se for pagamento com cartão
      if (paymentMethod === 'CREDIT_CARD' && !cardData) {
        return res.status(400).json({
          success: false,
          error: 'Dados do cartão são obrigatórios'
        });
      }

      // Buscar pedido com relacionamentos
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          items: {
            include: {
              product: true
            }
          },
          shippingAddress: true
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      // Verificar se pedido já foi pago
      if (order.paymentStatus === 'APPROVED') {
        return res.status(400).json({
          success: false,
          error: 'Este pedido já foi pago'
        });
      }

      // Selecionar serviço de pagamento correto
      const paymentService = PaymentFactory.getPaymentService(paymentMethod);

      let paymentResult;

      // Processar pagamento baseado no método
      switch (paymentMethod) {
        case 'PIX':
          paymentResult = await paymentService.createPixPayment(order);
          break;

        case 'BOLETO':
          paymentResult = await paymentService.createBoletoPayment(order);
          break;

        case 'CREDIT_CARD':
          paymentResult = await paymentService.createCardPayment(order, cardData);
          break;

        default:
          return res.status(400).json({
            success: false,
            error: 'Método de pagamento inválido'
          });
      }

      // Atualizar pedido com informações de pagamento
      const updateData = {
        paymentMethod: paymentMethod,
        paymentStatus: paymentResult.approved ? 'APPROVED' : 'PENDING',
        paymentData: paymentResult
      };

      // Adicionar IDs específicos do gateway
      if (paymentResult.gateway === 'mercadopago') {
        updateData.mpPaymentId = String(paymentResult.paymentId);
        updateData.mpStatus = paymentResult.status;
      } else if (paymentResult.gateway === 'pagbank') {
        updateData.pbOrderId = paymentResult.orderId;
        updateData.pbChargeId = paymentResult.chargeId;
        updateData.pbStatus = paymentResult.status;
      }

      // Se foi aprovado imediatamente, atualizar status do pedido
      if (paymentResult.approved) {
        updateData.status = 'CONFIRMED';
      }

      await prisma.order.update({
        where: { id: orderId },
        data: updateData
      });

      // Log de sucesso
      logger.info('Payment created successfully', {
        orderId,
        paymentMethod,
        gateway: paymentResult.gateway,
        approved: paymentResult.approved
      });

      return res.json({
        success: true,
        payment: paymentResult
      });

    } catch (error) {
      logger.error('Payment creation error:', {
        error: error.message,
        stack: error.stack
      });

      return res.status(500).json({
        success: false,
        error: 'Erro ao processar pagamento',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Webhook Mercado Pago
   */
  async webhookMercadoPago(req, res) {
    try {
      logger.info('Received MercadoPago webhook', { body: req.body });

      const paymentService = PaymentFactory.getPaymentService('PIX');
      const result = await paymentService.processWebhook(req.body);

      if (result && result.approved) {
        // Enviar email de confirmação (implementar depois)
        logger.info('Order approved via webhook', { orderId: result.orderId });
      }

      return res.sendStatus(200);

    } catch (error) {
      logger.error('Webhook MercadoPago error:', {
        error: error.message
      });
      return res.sendStatus(500);
    }
  }

  /**
   * Webhook PagBank
   */
  async webhookPagBank(req, res) {
    try {
      logger.info('Received PagBank webhook', { body: req.body });

      const paymentService = PaymentFactory.getPaymentService('CREDIT_CARD');
      const result = await paymentService.processWebhook(req.body);

      if (result && result.approved) {
        // Enviar email de confirmação (implementar depois)
        logger.info('Order approved via webhook', { orderId: result.orderId });
      }

      return res.sendStatus(200);

    } catch (error) {
      logger.error('Webhook PagBank error:', {
        error: error.message
      });
      return res.sendStatus(500);
    }
  }

  /**
   * Verificar status de pagamento
   */
  async checkStatus(req, res) {
    try {
      const { orderId } = req.params;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          orderNumber: true,
          paymentMethod: true,
          paymentStatus: true,
          mpPaymentId: true,
          pbOrderId: true,
          paymentData: true
        }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado'
        });
      }

      // Se já está aprovado, retornar status do banco
      if (order.paymentStatus === 'APPROVED') {
        return res.json({
          success: true,
          status: {
            status: 'APPROVED',
            approved: true,
            orderNumber: order.orderNumber
          }
        });
      }

      // Verificar status atualizado no gateway
      const paymentService = PaymentFactory.getPaymentService(order.paymentMethod);
      const paymentId = order.mpPaymentId || order.pbOrderId;

      if (!paymentId) {
        return res.json({
          success: true,
          status: {
            status: order.paymentStatus,
            approved: false
          }
        });
      }

      const status = await paymentService.checkPaymentStatus(paymentId);

      // Atualizar status no banco se mudou
      if (status.approved && order.paymentStatus !== 'APPROVED') {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'APPROVED',
            status: 'CONFIRMED'
          }
        });
      }

      return res.json({
        success: true,
        status: {
          ...status,
          orderNumber: order.orderNumber
        }
      });

    } catch (error) {
      logger.error('Status check error:', {
        error: error.message
      });

      return res.status(500).json({
        success: false,
        error: 'Erro ao verificar status'
      });
    }
  }

  /**
   * Calcular parcelas (PagBank)
   */
  async calculateInstallments(req, res) {
    try {
      const { amount } = req.query;

      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valor inválido'
        });
      }

      const paymentService = PaymentFactory.getPaymentService('CREDIT_CARD');
      const installments = paymentService.calculateInstallments(parseFloat(amount));

      return res.json({
        success: true,
        installments
      });

    } catch (error) {
      logger.error('Installments calculation error:', {
        error: error.message
      });

      return res.status(500).json({
        success: false,
        error: 'Erro ao calcular parcelas'
      });
    }
  }

  /**
   * Obter taxas dos gateways
   */
  async getFees(req, res) {
    try {
      const { amount, paymentMethod } = req.query;

      if (!amount || !paymentMethod) {
        const fees = PaymentFactory.getGatewayFees();
        return res.json({ success: true, fees });
      }

      const fee = PaymentFactory.calculateFee(parseFloat(amount), paymentMethod);

      return res.json({
        success: true,
        fee
      });

    } catch (error) {
      logger.error('Fees calculation error:', {
        error: error.message
      });

      return res.status(500).json({
        success: false,
        error: 'Erro ao calcular taxas'
      });
    }
  }
}

export default new PaymentController();
