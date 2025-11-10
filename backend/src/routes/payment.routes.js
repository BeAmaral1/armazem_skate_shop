import express from 'express';
import paymentController from '../controllers/payment.controller.js';

const router = express.Router();

/**
 * Rotas de Pagamento
 */

// Criar pagamento
router.post('/create', paymentController.createPayment);

// Verificar status
router.get('/status/:orderId', paymentController.checkStatus);

// Calcular parcelas
router.get('/installments', paymentController.calculateInstallments);

// Obter taxas
router.get('/fees', paymentController.getFees);

// Webhooks (públicos - sem autenticação)
router.post('/webhook/mercadopago', paymentController.webhookMercadoPago);
router.post('/webhook/pagbank', paymentController.webhookPagBank);

export default router;
