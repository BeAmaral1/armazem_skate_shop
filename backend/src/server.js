import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './utils/logger.js';
import paymentRoutes from './routes/payment.routes.js';
import productRoutes from './routes/product.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import orderRoutes from './routes/order.routes.js';
import { prisma } from './config/database.js';

// Carregar variáveis de ambiente
dotenv.config();

// Criar app Express
const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARES ====================

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger de requisições
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'connected'
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Payment routes
app.use('/api/payment', paymentRoutes);

// Product routes
app.use('/api/products', productRoutes);

// 404 Handler
app.use('*', (req, res) => {
  logger.warn('Route not found', { path: req.originalUrl });
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack
  });

  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  logger.info(`💳 MercadoPago Mode: ${process.env.MP_MODE}`);
  logger.info(`💳 PagBank Sandbox: ${process.env.PAGBANK_SANDBOX}`);
  logger.info('✅ Ready to accept payments!');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
