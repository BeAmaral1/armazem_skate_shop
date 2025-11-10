import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient();

// ==================== DASHBOARD ====================

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      recentOrders
    ] = await Promise.all([
      // Total de usuários
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      
      // Total de produtos
      prisma.product.count({ where: { active: true } }),
      
      // Total de pedidos
      prisma.order.count(),
      
      // Receita total (pedidos aprovados)
      prisma.order.aggregate({
        where: { paymentStatus: 'APPROVED' },
        _sum: { total: true }
      }),
      
      // Pedidos pendentes
      prisma.order.count({
        where: { paymentStatus: 'PENDING' }
      }),
      
      // Pedidos recentes
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true }
          },
          items: {
            include: {
              product: {
                select: { name: true, images: true }
              }
            }
          }
        }
      })
    ]);

    // Estatísticas dos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [ordersLast30Days, revenueLast30Days] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.order.aggregate({
        where: {
          paymentStatus: 'APPROVED',
          createdAt: { gte: thirtyDaysAgo }
        },
        _sum: { total: true }
      })
    ]);

    res.json({
      success: true,
      stats: {
        users: totalUsers,
        products: totalProducts,
        orders: totalOrders,
        revenue: totalRevenue._sum.total || 0,
        pendingOrders,
        ordersLast30Days,
        revenueLast30Days: revenueLast30Days._sum.total || 0
      },
      recentOrders
    });

  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas'
    });
  }
};

// ==================== USERS MANAGEMENT ====================

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          active: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              orders: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar usuários'
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { active } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { active },
      select: {
        id: true,
        email: true,
        name: true,
        active: true
      }
    });

    logger.info(`User ${userId} status updated to ${active}`, {
      userId,
      adminId: req.user.id
    });

    res.json({
      success: true,
      user
    });

  } catch (error) {
    logger.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status do usuário'
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Não permitir deletar super admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Não é possível deletar um Super Admin'
      });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    logger.warn(`User ${userId} deleted`, {
      userId,
      adminId: req.user.id
    });

    res.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });

  } catch (error) {
    logger.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar usuário'
    });
  }
};

// ==================== ORDERS MANAGEMENT ====================

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  images: true
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos'
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingCode } = req.body;

    const data = { status };
    if (trackingCode) data.trackingCode = trackingCode;
    if (status === 'SHIPPED') data.shippedAt = new Date();
    if (status === 'DELIVERED') data.deliveredAt = new Date();

    const order = await prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    logger.info(`Order ${orderId} status updated to ${status}`, {
      orderId,
      adminId: req.user.id
    });

    // TODO: Enviar email para o cliente notificando a mudança de status

    res.json({
      success: true,
      order
    });

  } catch (error) {
    logger.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status do pedido'
    });
  }
};

// ==================== LOGS ====================

export const getPaymentLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, gateway, orderId } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (gateway) where.gateway = gateway;
    if (orderId) where.orderId = orderId;

    const [logs, total] = await Promise.all([
      prisma.paymentLog.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.paymentLog.count({ where })
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching payment logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar logs de pagamento'
    });
  }
};

export const getSystemLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, level, module } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (level) where.level = level;
    if (module) where.module = module;

    const [logs, total] = await Promise.all([
      prisma.systemLog.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.systemLog.count({ where })
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching system logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar logs do sistema'
    });
  }
};

export const getWebhookLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, source, processed } = req.query;
    const skip = (page - 1) * limit;

    const where = {};
    if (source) where.source = source;
    if (processed !== undefined) where.processed = processed === 'true';

    const [logs, total] = await Promise.all([
      prisma.webhookLog.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.webhookLog.count({ where })
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching webhook logs:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar logs de webhook'
    });
  }
};

// ==================== ANALYTICS ====================

export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // dias
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Vendas por dia
    const salesByDay = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders
      WHERE payment_status = 'APPROVED'
        AND created_at >= ${daysAgo}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    // Produtos mais vendidos
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        subtotal: true
      },
      _count: {
        productId: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 10
    });

    // Buscar detalhes dos produtos
    const productIds = topProducts.map(p => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        images: true,
        price: true
      }
    });

    const topProductsWithDetails = topProducts.map(tp => ({
      ...tp,
      product: products.find(p => p.id === tp.productId)
    }));

    // Métodos de pagamento
    const paymentMethods = await prisma.order.groupBy({
      by: ['paymentMethod'],
      where: {
        paymentStatus: 'APPROVED',
        createdAt: { gte: daysAgo }
      },
      _count: {
        paymentMethod: true
      },
      _sum: {
        total: true
      }
    });

    res.json({
      success: true,
      analytics: {
        salesByDay,
        topProducts: topProductsWithDetails,
        paymentMethods
      }
    });

  } catch (error) {
    logger.error('Error fetching sales analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar análises de vendas'
    });
  }
};
