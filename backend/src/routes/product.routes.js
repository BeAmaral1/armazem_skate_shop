import express from 'express';
import productController from '../controllers/product.controller.js';
import { authenticate, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * Rotas Públicas de Produtos
 */

// Listar todos os produtos
// GET /api/products?category=tenis&brand=Nike&search=sb&featured=true&limit=20&offset=0
router.get('/', productController.getAllProducts);

// Produtos em destaque
// GET /api/products/featured?limit=10
router.get('/featured', productController.getFeaturedProducts);

// Listar categorias
// GET /api/products/categories
router.get('/categories', productController.getCategories);

// Listar marcas
// GET /api/products/brands
router.get('/brands', productController.getBrands);

/**
 * Rotas Admin de Produtos (requer autenticação + role admin)
 */

// Criar produto
// POST /api/products
router.post('/', authenticate, isAdmin, productController.createProduct);

// Atualizar produto
// PUT /api/products/:id
router.put('/:id', authenticate, isAdmin, productController.updateProduct);

// Deletar produto (soft delete)
// DELETE /api/products/:id
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

/**
 * Rotas de Busca (devem vir por último para não conflitar)
 */

// Buscar por slug (deve vir antes de /:id para não confundir)
// GET /api/products/slug/tenis-nike-sb-dunk-low
router.get('/slug/:slug', productController.getProductBySlug);

// Buscar por ID
// GET /api/products/123e4567-e89b-12d3-a456-426614174000
router.get('/:id', productController.getProductById);

export default router;
