import express from 'express';
import { prisma } from '../config/database.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ==================== PAGE CONTENT ====================

// Buscar conteúdo de uma página (PÚBLICO)
router.get('/content/:page', async (req, res) => {
  try {
    const { page } = req.params;
    const { language = 'pt-BR' } = req.query;

    const content = await prisma.pageContent.findMany({
      where: {
        page,
        language,
        active: true
      },
      orderBy: { section: 'asc' }
    });

    // Organizar por seção e chave
    const organized = content.reduce((acc, item) => {
      if (!acc[item.section]) {
        acc[item.section] = {};
      }
      acc[item.section][item.key] = {
        value: item.value,
        type: item.type
      };
      return acc;
    }, {});

    res.json({
      success: true,
      page,
      language,
      content: organized
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar conteúdo'
    });
  }
});

// Criar/Atualizar conteúdo (ADMIN)
router.post('/content', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page, section, key, value, type, language = 'pt-BR' } = req.body;

    const content = await prisma.pageContent.upsert({
      where: {
        page_section_key_language: {
          page,
          section,
          key,
          language
        }
      },
      update: {
        value,
        type: type || 'TEXT'
      },
      create: {
        page,
        section,
        key,
        value,
        type: type || 'TEXT',
        language
      }
    });

    res.json({
      success: true,
      content
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao salvar conteúdo'
    });
  }
});

// Atualizar múltiplos conteúdos de uma vez (ADMIN)
router.put('/content/bulk', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { contents } = req.body; // Array de { page, section, key, value, type }

    const promises = contents.map(item =>
      prisma.pageContent.upsert({
        where: {
          page_section_key_language: {
            page: item.page,
            section: item.section,
            key: item.key,
            language: item.language || 'pt-BR'
          }
        },
        update: {
          value: item.value,
          type: item.type || 'TEXT'
        },
        create: {
          page: item.page,
          section: item.section,
          key: item.key,
          value: item.value,
          type: item.type || 'TEXT',
          language: item.language || 'pt-BR'
        }
      })
    );

    await Promise.all(promises);

    res.json({
      success: true,
      message: `${contents.length} conteúdos atualizados`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar conteúdos'
    });
  }
});

// Deletar conteúdo (ADMIN)
router.delete('/content/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await prisma.pageContent.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Conteúdo deletado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar conteúdo'
    });
  }
});

// ==================== SITE SETTINGS ====================

// Buscar configurações (PÚBLICO)
router.get('/settings', async (req, res) => {
  try {
    const { group } = req.query;

    const where = group ? { group } : {};
    const settings = await prisma.siteSettings.findMany({ where });

    // Organizar por grupo
    const organized = settings.reduce((acc, item) => {
      if (!acc[item.group]) {
        acc[item.group] = {};
      }
      acc[item.group][item.key] = item.value;
      return acc;
    }, {});

    res.json({
      success: true,
      settings: organized
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar configurações'
    });
  }
});

// Atualizar configuração (ADMIN)
router.put('/settings/:key', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await prisma.siteSettings.update({
      where: { key },
      data: { value }
    });

    res.json({
      success: true,
      setting
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar configuração'
    });
  }
});

// ==================== BANNERS ====================

// Listar banners ativos (PÚBLICO)
router.get('/banners', async (req, res) => {
  try {
    const { position } = req.query;
    const now = new Date();

    const banners = await prisma.banner.findMany({
      where: {
        active: true,
        position: position || undefined,
        OR: [
          { startDate: null, endDate: null },
          { startDate: { lte: now }, endDate: { gte: now } },
          { startDate: { lte: now }, endDate: null },
          { startDate: null, endDate: { gte: now } }
        ]
      },
      orderBy: { order: 'asc' }
    });

    res.json({
      success: true,
      banners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar banners'
    });
  }
});

// Criar banner (ADMIN)
router.post('/banners', authenticateToken, isAdmin, async (req, res) => {
  try {
    const banner = await prisma.banner.create({
      data: req.body
    });

    res.json({
      success: true,
      banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao criar banner'
    });
  }
});

// Atualizar banner (ADMIN)
router.put('/banners/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const banner = await prisma.banner.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json({
      success: true,
      banner
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar banner'
    });
  }
});

// Deletar banner (ADMIN)
router.delete('/banners/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await prisma.banner.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Banner deletado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar banner'
    });
  }
});

// ==================== FAQs ====================

// Listar FAQs (PÚBLICO)
router.get('/faqs', async (req, res) => {
  try {
    const { category } = req.query;

    const faqs = await prisma.faq.findMany({
      where: {
        active: true,
        category: category || undefined
      },
      orderBy: { order: 'asc' }
    });

    res.json({
      success: true,
      faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar FAQs'
    });
  }
});

// Criar FAQ (ADMIN)
router.post('/faqs', authenticateToken, isAdmin, async (req, res) => {
  try {
    const faq = await prisma.faq.create({
      data: req.body
    });

    res.json({
      success: true,
      faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao criar FAQ'
    });
  }
});

// Atualizar FAQ (ADMIN)
router.put('/faqs/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const faq = await prisma.faq.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json({
      success: true,
      faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar FAQ'
    });
  }
});

// Deletar FAQ (ADMIN)
router.delete('/faqs/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await prisma.faq.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'FAQ deletado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar FAQ'
    });
  }
});

// ==================== CUPONS ====================

// Validar cupom (PÚBLICO)
router.post('/coupons/validate', async (req, res) => {
  try {
    const { code, cartValue } = req.body;
    const now = new Date();

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Cupom não encontrado'
      });
    }

    // Validações
    if (!coupon.active) {
      return res.status(400).json({
        success: false,
        error: 'Cupom inativo'
      });
    }

    if (coupon.startsAt && coupon.startsAt > now) {
      return res.status(400).json({
        success: false,
        error: 'Cupom ainda não está válido'
      });
    }

    if (coupon.expiresAt && coupon.expiresAt < now) {
      return res.status(400).json({
        success: false,
        error: 'Cupom expirado'
      });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({
        success: false,
        error: 'Cupom esgotado'
      });
    }

    if (coupon.minValue && cartValue < coupon.minValue) {
      return res.status(400).json({
        success: false,
        error: `Valor mínimo do pedido: R$ ${coupon.minValue.toFixed(2)}`
      });
    }

    // Calcular desconto
    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = cartValue * (coupon.value / 100);
    } else if (coupon.type === 'FIXED') {
      discount = coupon.value;
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description
      },
      discount: Math.min(discount, cartValue) // Desconto não pode ser maior que o valor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao validar cupom'
    });
  }
});

// Listar cupons (ADMIN)
router.get('/coupons', authenticateToken, isAdmin, async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar cupons'
    });
  }
});

// Criar cupom (ADMIN)
router.post('/coupons', authenticateToken, isAdmin, async (req, res) => {
  try {
    const data = {
      ...req.body,
      code: req.body.code.toUpperCase()
    };

    const coupon = await prisma.coupon.create({ data });

    res.json({
      success: true,
      coupon
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Código de cupom já existe'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Erro ao criar cupom'
    });
  }
});

// Atualizar cupom (ADMIN)
router.put('/coupons/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const coupon = await prisma.coupon.update({
      where: { id: req.params.id },
      data: req.body
    });

    res.json({
      success: true,
      coupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar cupom'
    });
  }
});

// Deletar cupom (ADMIN)
router.delete('/coupons/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await prisma.coupon.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Cupom deletado'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar cupom'
    });
  }
});

export default router;
