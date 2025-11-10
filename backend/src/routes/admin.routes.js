import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getPaymentLogs,
  getSystemLogs,
  getWebhookLogs,
  getSalesAnalytics
} from '../controllers/admin.controller.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas as rotas de admin precisam de autenticação e permissão de admin
router.use(authenticate);
router.use(isAdmin);

// ==================== DASHBOARD ====================
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getSalesAnalytics);

// ==================== USERS ====================
router.get('/users', getAllUsers);
router.patch('/users/:userId/status', updateUserStatus);
router.delete('/users/:userId', deleteUser);

// ==================== ORDERS ====================
router.get('/orders', getAllOrders);
router.patch('/orders/:orderId/status', updateOrderStatus);

// ==================== LOGS ====================
router.get('/logs/payments', getPaymentLogs);
router.get('/logs/system', getSystemLogs);
router.get('/logs/webhooks', getWebhookLogs);

export default router;
