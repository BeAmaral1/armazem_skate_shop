import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { productService } from '../services/api';
import { products as localProducts } from '../data/products';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // Iniciar com dados locais para carregamento instantâneo
  const [products, setProducts] = useState(localProducts);
  const [featuredProducts, setFeaturedProducts] = useState(
    localProducts.filter(p => p.featured)
  );
  const [categories, setCategories] = useState([
    ...new Set(localProducts.map(p => p.category))
  ]);
  const [brands, setBrands] = useState([
    ...new Set(localProducts.map(p => p.brand))
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useBackend, setUseBackend] = useState(false);

  // Não carrega do backend automaticamente para evitar lentidão
  // Use refreshProducts() manualmente quando backend estiver pronto

  // Carregar do backend (em segundo plano, opcional)
  const loadProductsFromBackend = async () => {
    try {
      // Timeout reduzido para 2 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await productService.getAll({ limit: 100 });
      clearTimeout(timeoutId);
      
      if (response.success) {
        setProducts(response.products);
        setFeaturedProducts(response.products.filter(p => p.featured));
        setCategories([...new Set(response.products.map(p => p.category))]);
        setBrands([...new Set(response.products.map(p => p.brand))]);
        setUseBackend(true);
        console.log('✅ Produtos carregados do backend');
      }
    } catch (err) {
      // Silencioso - já temos dados locais
      console.log('ℹ️ Usando dados locais (backend não disponível)');
    }
  };

  // Forçar reload do backend
  const refreshProducts = async () => {
    setLoading(true);
    await loadProductsFromBackend();
    setLoading(false);
  };

  // Buscar produto por ID (otimizado com useCallback)
  const getProductById = useCallback((id) => {
    return products.find(p => p.id === id || p.id === parseInt(id));
  }, [products]);

  // Buscar produtos por categoria (otimizado)
  const getProductsByCategory = useCallback((category) => {
    return products.filter(p => p.category === category);
  }, [products]);

  // Buscar produtos por marca (otimizado)
  const getProductsByBrand = useCallback((brand) => {
    return products.filter(p => p.brand === brand);
  }, [products]);

  // Buscar produtos (otimizado)
  const searchProducts = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery)
    );
  }, [products]);

  // Memoizar value para evitar re-renders
  const value = useMemo(() => ({
    products,
    featuredProducts,
    categories,
    brands,
    loading,
    error,
    useBackend,
    getProductById,
    getProductsByCategory,
    getProductsByBrand,
    searchProducts,
    refreshProducts
  }), [
    products,
    featuredProducts,
    categories,
    brands,
    loading,
    error,
    useBackend,
    getProductById,
    getProductsByCategory,
    getProductsByBrand,
    searchProducts
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de ProductProvider');
  }
  return context;
};

export default ProductContext;
