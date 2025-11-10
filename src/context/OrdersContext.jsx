import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};

// Dados mockados de pedidos
const MOCK_ORDERS = [
  {
    id: 'PED-2024-001',
    userId: 1, // João Silva
    date: '2024-10-25',
    status: 'delivered',
    total: 899.90,
    items: [
      {
        id: 1,
        name: 'Prancha de Surf Pro',
        image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=400&fit=crop',
        price: 899.90,
        quantity: 1,
        size: '6\'2"',
      },
    ],
    shipping: {
      method: 'Frete Expresso',
      cost: 0,
      address: {
        street: 'Rua das Flores, 123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
      },
    },
    payment: {
      method: 'Cartão de Crédito',
      installments: 3,
      cardBrand: 'Visa',
      lastDigits: '1234',
    },
    tracking: {
      code: 'BR123456789AA',
      url: 'https://tracking.example.com/BR123456789AA',
      carrier: 'Correios',
    },
    timeline: [
      { date: '2024-10-25T10:00:00', status: 'confirmed', description: 'Pedido confirmado' },
      { date: '2024-10-25T14:30:00', status: 'processing', description: 'Pagamento aprovado' },
      { date: '2024-10-26T09:00:00', status: 'shipped', description: 'Pedido enviado' },
      { date: '2024-10-28T16:45:00', status: 'delivered', description: 'Pedido entregue' },
    ],
  },
  {
    id: 'PED-2024-002',
    userId: 1,
    date: '2024-11-01',
    status: 'shipped',
    total: 459.90,
    items: [
      {
        id: 2,
        name: 'Shape Profissional',
        image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400&h=400&fit=crop',
        price: 299.90,
        quantity: 1,
      },
      {
        id: 3,
        name: 'Rodas Premium',
        image: 'https://images.unsplash.com/photo-1564982752979-d8ff02cb2494?w=400&h=400&fit=crop',
        price: 159.90,
        quantity: 1,
      },
    ],
    shipping: {
      method: 'Frete Padrão',
      cost: 0,
      estimatedDelivery: '2024-11-08',
      address: {
        street: 'Rua das Flores, 123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
      },
    },
    payment: {
      method: 'PIX',
    },
    tracking: {
      code: 'BR987654321BB',
      url: 'https://tracking.example.com/BR987654321BB',
      carrier: 'Correios',
    },
    timeline: [
      { date: '2024-11-01T11:20:00', status: 'confirmed', description: 'Pedido confirmado' },
      { date: '2024-11-01T11:25:00', status: 'processing', description: 'Pagamento aprovado' },
      { date: '2024-11-02T10:00:00', status: 'shipped', description: 'Pedido enviado' },
    ],
  },
  {
    id: 'PED-2024-003',
    userId: 1,
    date: '2024-11-04',
    status: 'processing',
    total: 1299.80,
    items: [
      {
        id: 4,
        name: 'Camiseta Surf Club',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        price: 89.90,
        quantity: 2,
        size: 'M',
      },
      {
        id: 5,
        name: 'Bermuda Boardshort',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
        price: 149.90,
        quantity: 1,
        size: 'G',
      },
    ],
    shipping: {
      method: 'Frete Padrão',
      cost: 0,
      estimatedDelivery: '2024-11-11',
      address: {
        street: 'Rua das Flores, 123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
      },
    },
    payment: {
      method: 'Cartão de Crédito',
      installments: 6,
      cardBrand: 'Mastercard',
      lastDigits: '5678',
    },
    timeline: [
      { date: '2024-11-04T09:15:00', status: 'confirmed', description: 'Pedido confirmado' },
      { date: '2024-11-04T09:20:00', status: 'processing', description: 'Processando pagamento' },
    ],
  },
];

export const OrdersProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carregar pedidos do usuário
  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setOrders([]);
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Filtrar pedidos do usuário logado
    const userOrders = MOCK_ORDERS.filter((order) => order.userId === user.id);
    setOrders(userOrders);
    setLoading(false);
  };

  // Buscar pedido por ID
  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  // Adicionar novo pedido
  const addOrder = async (orderData) => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newOrder = {
        id: `PED-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
        userId: user.id,
        date: new Date().toISOString().split('T')[0],
        status: 'confirmed',
        ...orderData,
        timeline: [
          {
            date: new Date().toISOString(),
            status: 'confirmed',
            description: 'Pedido confirmado',
          },
        ],
      };

      // Adicionar ao mock (apenas na sessão)
      MOCK_ORDERS.push(newOrder);
      setOrders((prev) => [newOrder, ...prev]);

      return { success: true, order: newOrder };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Filtrar pedidos por status
  const getOrdersByStatus = (status) => {
    if (status === 'all') return orders;
    return orders.filter((order) => order.status === status);
  };

  // Contar pedidos por status
  const getOrdersCount = () => {
    return {
      all: orders.length,
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      shipped: orders.filter((o) => o.status === 'shipped').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  };

  // Status labels
  const getStatusLabel = (status) => {
    const labels = {
      confirmed: 'Confirmado',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
      processing: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
      delivered: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
    };
    return colors[status] || colors.confirmed;
  };

  const value = {
    orders,
    loading,
    getOrderById,
    addOrder,
    getOrdersByStatus,
    getOrdersCount,
    getStatusLabel,
    getStatusColor,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};
