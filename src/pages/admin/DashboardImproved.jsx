import React, { useState, useEffect } from 'react';
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
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { BarChart, LineChart, DonutChart } from '../../components/admin/SimpleChart';
import { adminService } from '../../services/api';

const DashboardImproved = () => {
  const [period, setPeriod] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  // Carregar dados do dashboard
  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminService.getDashboardStats();
      setDashboardData(response);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados. Mostrando dados de exemplo.');
      // Em desenvolvimento, manter dados mock
    } finally {
      setLoading(false);
    }
  };

  // Mock data - depois virá da API
  const stats = [
    {
      title: 'Vendas Hoje',
      value: 'R$ 12.450,00',
      change: '+15%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Pedidos',
      value: '47',
      change: '+8%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500'
    },
    {
      title: 'Produtos',
      value: '156',
      change: '+3',
      trend: 'up',
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Clientes',
      value: '1.234',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  // Dados para gráfico de vendas (linha)
  const salesData = [
    { label: 'Seg', value: 1200 },
    { label: 'Ter', value: 1900 },
    { label: 'Qua', value: 1500 },
    { label: 'Qui', value: 2200 },
    { label: 'Sex', value: 2800 },
    { label: 'Sáb', value: 3200 },
    { label: 'Dom', value: 2500 }
  ];

  // Dados para gráfico de categorias (barras)
  const categoriesData = [
    { label: 'Shapes', value: 45 },
    { label: 'Roupas', value: 32 },
    { label: 'Calçados', value: 28 },
    { label: 'Acessórios', value: 25 },
    { label: 'Trucks', value: 18 }
  ];

  // Dados para gráfico de status (donut)
  const ordersStatusData = [
    { label: 'Entregues', value: 45 },
    { label: 'Em trânsito', value: 18 },
    { label: 'Confirmados', value: 12 },
    { label: 'Pendentes', value: 8 }
  ];

  const recentOrders = [
    { id: '#1234', customer: 'João Silva', total: 450.00, status: 'pending', date: 'Hoje às 14:30' },
    { id: '#1233', customer: 'Maria Santos', total: 890.00, status: 'confirmed', date: 'Hoje às 13:15' },
    { id: '#1232', customer: 'Pedro Costa', total: 320.00, status: 'shipped', date: 'Hoje às 11:00' },
    { id: '#1231', customer: 'Ana Lima', total: 670.00, status: 'delivered', date: 'Ontem às 18:45' },
    { id: '#1230', customer: 'Carlos Rocha', total: 1200.00, status: 'confirmed', date: 'Ontem às 16:20' }
  ];

  const topProducts = [
    { name: 'Shape Element Cloud', sales: 45, revenue: 20250 },
    { name: 'Truck Independent 149', sales: 32, revenue: 10240 },
    { name: 'Tênis Nike SB', sales: 28, revenue: 8960 },
    { name: 'Camiseta Element', sales: 52, revenue: 4675 },
    { name: 'Rodas Spitfire 53mm', sales: 38, revenue: 9500 }
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    const labels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Visão geral do seu e-commerce</p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dark-600 text-sm"
        >
          <option value="today">Hoje</option>
          <option value="7days">Últimos 7 dias</option>
          <option value="30days">Últimos 30 dias</option>
          <option value="90days">Últimos 90 dias</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Vendas da Semana</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <LineChart data={salesData} height={250} />
        </div>

        {/* Orders Status Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Status dos Pedidos</h2>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-center">
            <DonutChart data={ordersStatusData} size={220} />
          </div>
        </div>
      </div>

      {/* Categories Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Vendas por Categoria</h2>
          <Package className="w-5 h-5 text-gray-400" />
        </div>
        <BarChart data={categoriesData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Pedidos Recentes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">R$ {order.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-dark-600 hover:text-dark-700 transition-colors">
              Ver Todos os Pedidos →
            </button>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Produtos Mais Vendidos</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-50 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} vendas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">R$ {product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Visitantes Hoje</p>
              <p className="text-2xl font-bold text-gray-900">2.845</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +12% vs ontem
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900">3.2%</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +0.4% vs semana passada
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Avaliação Média</p>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-xs text-gray-500 mt-1">
                Baseado em 234 avaliações
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardImproved;
