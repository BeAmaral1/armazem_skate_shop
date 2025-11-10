import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

// ==================== REGISTER ====================

export const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'CUSTOMER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    // Criar carrinho vazio
    await prisma.cart.create({
      data: {
        userId: user.id
      }
    });

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info(`New user registered: ${user.email}`, { userId: user.id });

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      token,
      user
    });

  } catch (error) {
    logger.error('Error in register:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário'
    });
  }
};

// ==================== LOGIN ====================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar se está ativo
    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo. Entre em contato com o suporte.'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info(`User logged in: ${user.email}`, { userId: user.id });

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    logger.error('Error in login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login'
    });
  }
};

// ==================== ADMIN LOGIN ====================

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar se é admin
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      logger.warn(`Non-admin user attempted admin login: ${email}`);
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Verificar se está ativo
    if (!user.active) {
      return res.status(403).json({
        success: false,
        message: 'Usuário inativo'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' } // Token de admin expira mais rápido
    );

    logger.info(`Admin logged in: ${user.email}`, { userId: user.id, role: user.role });

    res.json({
      success: true,
      message: 'Login admin realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    logger.error('Error in admin login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer login'
    });
  }
};

// ==================== GET PROFILE ====================

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        cpf: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            wishlist: true
          }
        }
      }
    });

    res.json({
      success: true,
      user
    });

  } catch (error) {
    logger.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar perfil'
    });
  }
};

// ==================== UPDATE PROFILE ====================

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, cpf } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, cpf },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        cpf: true
      }
    });

    logger.info(`User profile updated: ${user.email}`, { userId: user.id });

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user
    });

  } catch (error) {
    logger.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar perfil'
    });
  }
};

// ==================== CHANGE PASSWORD ====================

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    // Verificar senha atual
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    logger.info(`User password changed: ${user.email}`, { userId: user.id });

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });

  } catch (error) {
    logger.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao alterar senha'
    });
  }
};
