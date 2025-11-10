import express from 'express';
import {
  register,
  login,
  adminLogin,
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rotas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);

// Rotas protegidas
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

export default router;
