import express from 'express';
import productController from '../controllers/product.controller.js';

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

// Buscar por slug (deve vir antes de /:id para não confundir)
// GET /api/products/slug/tenis-nike-sb-dunk-low
router.get('/slug/:slug', productController.getProductBySlug);

// Buscar por ID
// GET /api/products/123e4567-e89b-12d3-a456-426614174000
router.get('/:id', productController.getProductById);

export default router;
