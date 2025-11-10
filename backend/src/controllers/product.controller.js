import { prisma } from '../config/database.js';
import logger from '../utils/logger.js';

class ProductController {
  /**
   * Listar todos os produtos
   */
  async getAllProducts(req, res) {
    try {
      const { 
        category, 
        brand, 
        search, 
        featured,
        limit = 50,
        offset = 0 
      } = req.query;

      const where = {
        active: true
      };

      // Filtros opcionais
      if (category) where.category = category;
      if (brand) where.brand = brand;
      if (featured === 'true') where.featured = true;
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      const products = await prisma.product.findMany({
        where,
        take: parseInt(limit),
        skip: parseInt(offset),
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { reviews: true }
          }
        }
      });

      // Calcular rating médio para cada produto
      const productsWithRating = await Promise.all(
        products.map(async (product) => {
          const reviews = await prisma.review.findMany({
            where: { productId: product.id },
            select: { rating: true }
          });

          const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

          return {
            ...product,
            reviewCount: product._count.reviews,
            rating: Number(avgRating.toFixed(1))
          };
        })
      );

      const total = await prisma.product.count({ where });

      logger.info('Products listed', { 
        count: products.length, 
        total,
        filters: { category, brand, search, featured }
      });

      return res.json({
        success: true,
        products: productsWithRating,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + products.length < total
        }
      });

    } catch (error) {
      logger.error('Error listing products:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Erro ao listar produtos'
      });
    }
  }

  /**
   * Buscar produto por ID
   */
  async getProductById(req, res) {
    try {
      const { id } = req.params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          reviews: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      // Calcular rating médio
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

      const productWithRating = {
        ...product,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: product.reviews.length
      };

      logger.info('Product retrieved', { productId: id });

      return res.json({
        success: true,
        product: productWithRating
      });

    } catch (error) {
      logger.error('Error getting product:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar produto'
      });
    }
  }

  /**
   * Buscar produto por slug
   */
  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;

      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          reviews: {
            include: {
              user: {
                select: { name: true, email: true }
              }
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      // Calcular rating médio
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        : 0;

      const productWithRating = {
        ...product,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: product.reviews.length
      };

      logger.info('Product retrieved by slug', { slug });

      return res.json({
        success: true,
        product: productWithRating
      });

    } catch (error) {
      logger.error('Error getting product by slug:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar produto'
      });
    }
  }

  /**
   * Listar categorias disponíveis
   */
  async getCategories(req, res) {
    try {
      const categories = await prisma.product.findMany({
        where: { active: true },
        select: { category: true },
        distinct: ['category']
      });

      const categoryList = categories.map(c => c.category);

      return res.json({
        success: true,
        categories: categoryList
      });

    } catch (error) {
      logger.error('Error getting categories:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar categorias'
      });
    }
  }

  /**
   * Listar marcas disponíveis
   */
  async getBrands(req, res) {
    try {
      const brands = await prisma.product.findMany({
        where: { active: true },
        select: { brand: true },
        distinct: ['brand']
      });

      const brandList = brands.map(b => b.brand).sort();

      return res.json({
        success: true,
        brands: brandList
      });

    } catch (error) {
      logger.error('Error getting brands:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar marcas'
      });
    }
  }

  /**
   * Produtos em destaque
   */
  async getFeaturedProducts(req, res) {
    try {
      const { limit = 10 } = req.query;

      const products = await prisma.product.findMany({
        where: { 
          active: true,
          featured: true 
        },
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      });

      logger.info('Featured products listed', { count: products.length });

      return res.json({
        success: true,
        products
      });

    } catch (error) {
      logger.error('Error getting featured products:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Erro ao buscar produtos em destaque'
      });
    }
  }

  /**
   * Criar produto (ADMIN)
   */
  async createProduct(req, res) {
    try {
      const productData = req.body;

      // Gerar slug a partir do nome
      const slug = productData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const product = await prisma.product.create({
        data: {
          ...productData,
          slug,
          active: productData.active !== undefined ? productData.active : true
        }
      });

      logger.info('Product created', { productId: product.id, name: product.name });

      return res.status(201).json({
        success: true,
        product
      });

    } catch (error) {
      logger.error('Error creating product:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Erro ao criar produto'
      });
    }
  }

  /**
   * Atualizar produto (ADMIN)
   */
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;

      // Verificar se produto existe
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      // Se o nome mudou, atualizar o slug
      if (productData.name && productData.name !== existingProduct.name) {
        productData.slug = productData.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      }

      const product = await prisma.product.update({
        where: { id },
        data: productData
      });

      logger.info('Product updated', { productId: id, name: product.name });

      return res.json({
        success: true,
        product
      });

    } catch (error) {
      logger.error('Error updating product:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Erro ao atualizar produto'
      });
    }
  }

  /**
   * Deletar produto (ADMIN)
   */
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      // Verificar se produto existe
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado'
        });
      }

      // Soft delete - apenas desativar
      await prisma.product.update({
        where: { id },
        data: { active: false }
      });

      logger.info('Product deleted (soft)', { productId: id });

      return res.json({
        success: true,
        message: 'Produto deletado com sucesso'
      });

    } catch (error) {
      logger.error('Error deleting product:', { error: error.message });
      return res.status(500).json({
        success: false,
        error: 'Erro ao deletar produto'
      });
    }
  }
}

export default new ProductController();
