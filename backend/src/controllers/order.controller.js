import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';
import { sanitizeString } from '../utils/validators.js';

const prisma = new PrismaClient();

// Map para prevenir duplicação (em produção, use Redis)
const recentOrders = new Map();

class OrderController {
  /**
   * Criar novo pedido com todas as validações de segurança
   */
  async createOrder(req, res) {
    const transaction = await prisma.$transaction(async (tx) => {
      try {
        const { user, items, shippingAddress, total, subtotal, shipping, discount } = req.body;
        const userId = req.user?.id; // Se autenticado

        // ==================== PREVENIR DUPLICAÇÃO ====================
        const orderHash = this.generateOrderHash(user.email, items, total);
        const recentOrder = recentOrders.get(orderHash);

        if (recentOrder && Date.now() - recentOrder.timestamp < 60000) { // 1 minuto
          logger.warn('Duplicate order attempt detected', {
            email: user.email,
            hash: orderHash
          });

          return res.status(400).json({
            success: false,
            message: 'Pedido duplicado detectado. Aguarde 1 minuto antes de tentar novamente.',
            orderId: recentOrder.orderId
          });
        }

        // ==================== VERIFICAR ESTOQUE ====================
        for (const item of items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            select: { id: true, stock: true, active: true, name: true }
          });

          if (!product) {
            throw new Error(`Produto ${item.productId} não encontrado`);
          }

          if (!product.active) {
            throw new Error(`Produto ${product.name} não está mais disponível`);
          }

          if (product.stock < item.quantity) {
            throw new Error(`Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`);
          }
        }

        // ==================== GERAR NÚMERO DO PEDIDO ====================
        const orderNumber = await this.generateOrderNumber(tx);

        // ==================== CRIAR ENDEREÇO ====================
        let addressId = shippingAddress.id;

        if (!addressId) {
          // Criar novo endereço
          const newAddress = await tx.address.create({
            data: {
              userId: userId || null,
              name: 'Endereço de Entrega',
              zipCode: shippingAddress.zipCode,
              street: shippingAddress.street,
              number: shippingAddress.number,
              complement: shippingAddress.complement || null,
              neighborhood: shippingAddress.neighborhood,
              city: shippingAddress.city,
              state: shippingAddress.state,
              country: shippingAddress.country || 'Brasil'
            }
          });
          addressId = newAddress.id;
        }

        // ==================== CRIAR PEDIDO ====================
        const order = await tx.order.create({
          data: {
            orderNumber,
            userId: userId || null,
            // Salvar dados do comprador (importante para guest checkout)
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phone,
            customerCpf: user.cpf || null,
            subtotal,
            shipping,
            discount,
            total,
            status: 'PENDING',
            paymentStatus: 'PENDING',
            addressId,
            items: {
              create: items.map(item => ({
                productId: item.productId,
                productName: sanitizeString(item.name),
                productImage: item.image,
                productSku: item.sku || `SKU-${item.productId}`,
                quantity: item.quantity,
                price: item.price,
                size: item.size || null,
                color: item.color || null,
                subtotal: item.price * item.quantity
              }))
            }
          },
          include: {
            items: {
              include: {
                product: true
              }
            },
            shippingAddress: true
          }
        });

        // ==================== REDUZIR ESTOQUE ====================
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }

        // ==================== REGISTRAR NO MAP DE PREVENÇÃO ====================
        recentOrders.set(orderHash, {
          orderId: order.id,
          timestamp: Date.now()
        });

        // Limpar após 5 minutos
        setTimeout(() => {
          recentOrders.delete(orderHash);
        }, 5 * 60 * 1000);

        // ==================== LOG DE AUDITORIA ====================
        await tx.systemLog.create({
          data: {
            level: 'INFO',
            module: 'order',
            action: 'create',
            message: `Order created: ${order.orderNumber}`,
            data: {
              orderId: order.id,
              orderNumber: order.orderNumber,
              total: order.total,
              itemsCount: items.length,
              fraudAnalysis: req.fraudAnalysis || null
            },
            userId: userId || null,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
          }
        });

        logger.info('Order created successfully', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          total: order.total,
          itemsCount: items.length
        });

        return order;

      } catch (error) {
        logger.error('Error creating order:', error);
        throw error;
      }
    });

    // Se chegou aqui, transação foi bem-sucedida
    return res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      order: {
        id: transaction.id,
        orderNumber: transaction.orderNumber,
        total: transaction.total,
        status: transaction.status,
        paymentStatus: transaction.paymentStatus,
        items: transaction.items,
        shippingAddress: transaction.shippingAddress
      }
    });
  }

  /**
   * Gerar hash único para detectar duplicação
   */
  generateOrderHash(email, items, total) {
    const itemsString = items
      .map(item => `${item.productId}:${item.quantity}`)
      .sort()
      .join('|');
    
    return `${email}:${itemsString}:${total}`;
  }

  /**
   * Gerar número único de pedido
   */
  async generateOrderNumber(tx) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Buscar último número do dia
    const lastOrder = await tx.order.findFirst({
      where: {
        orderNumber: {
          startsWith: `ORD-${year}${month}${day}`
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-').pop());
      sequence = lastSequence + 1;
    }

    return `ORD-${year}${month}${day}-${String(sequence).padStart(4, '0')}`;
  }

  /**
   * Buscar pedidos do usuário
   */
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        prisma.order.findMany({
          where: { userId },
          skip,
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    images: true
                  }
                }
              }
            },
            shippingAddress: true
          }
        }),
        prisma.order.count({ where: { userId } })
      ]);

      return res.json({
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
      logger.error('Error fetching user orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar pedidos'
      });
    }
  }

  /**
   * Buscar detalhes de um pedido específico
   */
  async getOrderById(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user?.id;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
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
          message: 'Pedido não encontrado'
        });
      }

      // Verificar se o pedido pertence ao usuário (se não for admin)
      if (userId && order.userId !== userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      return res.json({
        success: true,
        order
      });

    } catch (error) {
      logger.error('Error fetching order:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar pedido'
      });
    }
  }

  /**
   * Cancelar pedido (apenas se ainda não foi pago)
   */
  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;

      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Pedido não encontrado'
        });
      }

      // Verificar se pedido pertence ao usuário
      if (order.userId !== userId && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      // Verificar se pode cancelar
      if (order.paymentStatus === 'APPROVED') {
        return res.status(400).json({
          success: false,
          message: 'Não é possível cancelar um pedido já pago. Solicite reembolso.'
        });
      }

      if (order.status === 'CANCELLED') {
        return res.status(400).json({
          success: false,
          message: 'Pedido já está cancelado'
        });
      }

      // Cancelar pedido e devolver estoque
      await prisma.$transaction(async (tx) => {
        // Devolver estoque
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          });
        }

        // Atualizar pedido
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: 'CANCELLED',
            paymentStatus: 'CANCELLED',
            cancelledAt: new Date(),
            cancelReason: reason || 'Cancelado pelo cliente'
          }
        });

        // Log
        await tx.systemLog.create({
          data: {
            level: 'INFO',
            module: 'order',
            action: 'cancel',
            message: `Order cancelled: ${order.orderNumber}`,
            data: {
              orderId: order.id,
              reason: reason || 'Cancelado pelo cliente'
            },
            userId,
            ipAddress: req.ip
          }
        });
      });

      logger.info('Order cancelled', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId
      });

      return res.json({
        success: true,
        message: 'Pedido cancelado com sucesso'
      });

    } catch (error) {
      logger.error('Error cancelling order:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao cancelar pedido'
      });
    }
  }
}

export default new OrderController();
