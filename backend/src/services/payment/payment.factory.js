import MercadoPagoService from './mercadopago.service.js';
import PagBankService from './pagbank.service.js';
import logger from '../../utils/logger.js';

/**
 * Factory para escolher o gateway de pagamento correto
 * 
 * PIX + Boleto → Mercado Pago (menor taxa)
 * Cartão → PagBank (menor taxa)
 */
class PaymentFactory {
  static getPaymentService(paymentMethod) {
    logger.info('Selecting payment gateway', { paymentMethod });

    switch (paymentMethod) {
      case 'PIX':
      case 'BOLETO':
        logger.info('Using MercadoPago for PIX/Boleto');
        return new MercadoPagoService();

      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        logger.info('Using PagBank for card payment');
        return new PagBankService();

      default:
        logger.error('Unsupported payment method', { paymentMethod });
        throw new Error(`Método de pagamento não suportado: ${paymentMethod}`);
    }
  }

  /**
   * Obter informações sobre taxas de cada gateway
   */
  static getGatewayFees() {
    return {
      mercadopago: {
        pix: {
          percentage: 0.99,
          fixed: 0,
          description: 'PIX - 0,99% por transação'
        },
        boleto: {
          percentage: 3.99,
          fixed: 0,
          description: 'Boleto - 3,99% por transação'
        }
      },
      pagbank: {
        credit_card: {
          percentage: 3.19,
          fixed: 0.40,
          description: 'Cartão de Crédito - 3,19% + R$ 0,40'
        },
        debit_card: {
          percentage: 2.99,
          fixed: 0.40,
          description: 'Cartão de Débito - 2,99% + R$ 0,40'
        }
      }
    };
  }

  /**
   * Calcular taxa de pagamento
   */
  static calculateFee(amount, paymentMethod) {
    const fees = this.getGatewayFees();
    let feeConfig;

    switch (paymentMethod) {
      case 'PIX':
        feeConfig = fees.mercadopago.pix;
        break;
      case 'BOLETO':
        feeConfig = fees.mercadopago.boleto;
        break;
      case 'CREDIT_CARD':
        feeConfig = fees.pagbank.credit_card;
        break;
      case 'DEBIT_CARD':
        feeConfig = fees.pagbank.debit_card;
        break;
      default:
        return 0;
    }

    const percentageFee = (amount * feeConfig.percentage) / 100;
    const totalFee = percentageFee + feeConfig.fixed;

    return {
      percentage: feeConfig.percentage,
      fixed: feeConfig.fixed,
      total: Number(totalFee.toFixed(2)),
      netAmount: Number((amount - totalFee).toFixed(2)),
      description: feeConfig.description
    };
  }
}

export default PaymentFactory;
