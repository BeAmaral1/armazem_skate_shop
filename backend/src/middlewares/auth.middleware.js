import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

// Verificar se o usuário está autenticado
export const authenticate = async (req, res, next) => {
  try {
    // Pegar token do header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo'
      });
    }

    // Adicionar usuário à requisição
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }

    logger.error('Error in authentication middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro na autenticação'
    });
  }
};

// Verificar se o usuário é admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};

// Verificar se o usuário é super admin
export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas super administradores.'
    });
  }
  next();
};
