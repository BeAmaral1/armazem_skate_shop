import axios from 'axios';

// URL base da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Criar instância do axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token em requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== PRODUCTS ====================

export const productService = {
  // Listar todos os produtos
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Buscar produto por ID
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Buscar produto por slug
  getBySlug: async (slug) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  // Produtos em destaque
  getFeatured: async (limit = 10) => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response.data;
  },

  // Buscar por categoria
  getByCategory: async (category, params = {}) => {
    const response = await api.get('/products', { 
      params: { ...params, category } 
    });
    return response.data;
  },

  // Buscar por marca
  getByBrand: async (brand, params = {}) => {
    const response = await api.get('/products', { 
      params: { ...params, brand } 
    });
    return response.data;
  },

  // Buscar produtos
  search: async (query, params = {}) => {
    const response = await api.get('/products', { 
      params: { ...params, search: query } 
    });
    return response.data;
  },

  // Listar categorias
  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  // Listar marcas
  getBrands: async () => {
    const response = await api.get('/products/brands');
    return response.data;
  }
};

// ==================== PAYMENT ====================

export const paymentService = {
  // Criar pagamento
  create: async (paymentData) => {
    const response = await api.post('/payment/create', paymentData);
    return response.data;
  },

  // Verificar status
  checkStatus: async (orderId) => {
    const response = await api.get(`/payment/status/${orderId}`);
    return response.data;
  },

  // Calcular parcelas
  calculateInstallments: async (amount) => {
    const response = await api.get('/payment/installments', { 
      params: { amount } 
    });
    return response.data;
  },

  // Obter taxas
  getFees: async (amount, paymentMethod) => {
    const response = await api.get('/payment/fees', { 
      params: { amount, paymentMethod } 
    });
    return response.data;
  }
};

// ==================== AUTH (Futuro) ====================

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default api;
