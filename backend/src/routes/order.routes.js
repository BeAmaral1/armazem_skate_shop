import express from 'express';
import orderController from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateCheckoutData, checkFraud } from '../middlewares/validateCheckout.middleware.js';
import { orderCreationLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

/**
 * Criar novo pedido
 * - Rate limiting (3 pedidos por 5 min)
 * - Validação completa de dados
 * - Verificação anti-fraude
 * - Verificação de estoque
 * - Proteção contra duplicação
 */
router.post(
  '/create',
  orderCreationLimiter,
  validateCheckoutData,
  checkFraud,
  orderController.createOrder
);

/**
 * Buscar pedidos do usuário autenticado
 */
router.get(
  '/my-orders',
  authenticate,
  orderController.getUserOrders
);

/**
 * Buscar detalhes de um pedido específico
 */
router.get(
  '/:orderId',
  orderController.getOrderById
);

/**
 * Cancelar pedido
 */
router.post(
  '/:orderId/cancel',
  authenticate,
  orderController.cancelOrder
);

export default router;
