import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign,
  Eye,
  Star,
  Calendar,
  BarChart3
} from 'lucide-react';
import { adminService, productService } from '../../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [dash, productsResp] = await Promise.all([
          adminService.getDashboardStats(),
          productService.getAll({ limit: 200 })
        ]);

        setStats(dash.stats);
        setRecentOrders(dash.recentOrders || []);

        const products = productsResp.products || [];
        const low = products
          .filter(p => (p.stock ?? 0) > 0 && p.stock <= 10)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 10);
        setLowStockProducts(low);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Erro ao carregar dados do dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };

    const labels = {
      PENDING: 'Pendente',
      CONFIRMED: 'Confirmado',
      SHIPPED: 'Enviado',
      DELIVERED: 'Entregue',
      CANCELLED: 'Cancelado'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards (dados reais) */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-green-500"><DollarSign className="w-6 h-6 text-white" /></div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Receita Total</h3>
            <p className="text-2xl font-bold text-gray-900">R$ {Number(stats.revenue).toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-blue-500"><ShoppingCart className="w-6 h-6 text-white" /></div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pedidos</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-purple-500"><Package className="w-6 h-6 text-white" /></div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Produtos Ativos</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.products}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-orange-500"><Users className="w-6 h-6 text-white" /></div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Clientes</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pedidos Recentes (reais) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Pedidos Recentes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900">{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600">{order.user?.name || order.customerName || '-'}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">R$ {Number(order.total || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-dark-600 hover:text-dark-700 transition-colors">
              Ver Todos os Pedidos →
            </button>
          </div>
        </div>

        {/* Estoque Baixo (real) */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Estoque Baixo</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm mb-1">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    product.stock <= 3 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.stock} un.
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-dark-600 hover:text-dark-700 transition-colors">
              Ver Todos os Produtos →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
