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

// ==================== CMS ====================

export const cmsService = {
  // Buscar conteúdo de uma página
  getPageContent: async (page, language = 'pt-BR') => {
    const response = await api.get(`/cms/content/${page}`, {
      params: { language }
    });
    return response.data;
  },

  // Criar/atualizar conteúdo (admin)
  saveContent: async (contentData) => {
    const response = await api.post('/cms/content', contentData);
    return response.data;
  },

  // Atualizar múltiplos conteúdos (admin)
  saveBulkContent: async (contents) => {
    const response = await api.put('/cms/content/bulk', { contents });
    return response.data;
  },

  // Deletar conteúdo (admin)
  deleteContent: async (id) => {
    const response = await api.delete(`/cms/content/${id}`);
    return response.data;
  },

  // Buscar configurações do site
  getSettings: async (group = null) => {
    const params = group ? { group } : {};
    const response = await api.get('/cms/settings', { params });
    return response.data;
  },

  // Atualizar configuração (admin)
  updateSetting: async (key, value) => {
    const response = await api.put(`/cms/settings/${key}`, { value });
    return response.data;
  },

  // Buscar banners
  getBanners: async (position = null) => {
    const params = position ? { position } : {};
    const response = await api.get('/cms/banners', { params });
    return response.data;
  },

  // Criar banner (admin)
  createBanner: async (bannerData) => {
    const response = await api.post('/cms/banners', bannerData);
    return response.data;
  },

  // Atualizar banner (admin)
  updateBanner: async (id, bannerData) => {
    const response = await api.put(`/cms/banners/${id}`, bannerData);
    return response.data;
  },

  // Deletar banner (admin)
  deleteBanner: async (id) => {
    const response = await api.delete(`/cms/banners/${id}`);
    return response.data;
  },

  // Buscar FAQs
  getFaqs: async (category = null) => {
    const params = category ? { category } : {};
    const response = await api.get('/cms/faqs', { params });
    return response.data;
  },

  // Criar FAQ (admin)
  createFaq: async (faqData) => {
    const response = await api.post('/cms/faqs', faqData);
    return response.data;
  },

  // Atualizar FAQ (admin)
  updateFaq: async (id, faqData) => {
    const response = await api.put(`/cms/faqs/${id}`, faqData);
    return response.data;
  },

  // Deletar FAQ (admin)
  deleteFaq: async (id) => {
    const response = await api.delete(`/cms/faqs/${id}`);
    return response.data;
  },

  // Validar cupom
  validateCoupon: async (code, cartValue) => {
    const response = await api.post('/cms/coupons/validate', { 
      code, 
      cartValue 
    });
    return response.data;
  },

  // Listar cupons (admin)
  getCoupons: async () => {
    const response = await api.get('/cms/coupons');
    return response.data;
  },

  // Criar cupom (admin)
  createCoupon: async (couponData) => {
    const response = await api.post('/cms/coupons', couponData);
    return response.data;
  },

  // Atualizar cupom (admin)
  updateCoupon: async (id, couponData) => {
    const response = await api.put(`/cms/coupons/${id}`, couponData);
    return response.data;
  },

  // Deletar cupom (admin)
  deleteCoupon: async (id) => {
    const response = await api.delete(`/cms/coupons/${id}`);
    return response.data;
  }
};

// ==================== ADMIN ====================

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAnalytics: async (period) => {
    const response = await api.get('/admin/analytics', { params: { period } });
    return response.data;
  },

  // Orders
  getAllOrders: async (filters = {}) => {
    const response = await api.get('/admin/orders', { params: filters });
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Users/Customers
  getAllUsers: async (filters = {}) => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },

  updateUserStatus: async (userId, status) => {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Logs
  getPaymentLogs: async () => {
    const response = await api.get('/admin/logs/payments');
    return response.data;
  },

  getSystemLogs: async () => {
    const response = await api.get('/admin/logs/system');
    return response.data;
  },

  getWebhookLogs: async () => {
    const response = await api.get('/admin/logs/webhooks');
    return response.data;
  }
};

// Adicionar métodos CRUD ao productService
productService.create = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

productService.update = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

productService.delete = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export default api;
