import React, { useState } from 'react';
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

const Dashboard = () => {
  const [period, setPeriod] = useState('7days');

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

  const recentOrders = [
    { id: '#1234', customer: 'João Silva', total: 'R$ 450,00', status: 'pending', date: 'Hoje às 14:30' },
    { id: '#1233', customer: 'Maria Santos', total: 'R$ 890,00', status: 'confirmed', date: 'Hoje às 13:15' },
    { id: '#1232', customer: 'Pedro Costa', total: 'R$ 320,00', status: 'shipped', date: 'Hoje às 11:00' },
    { id: '#1231', customer: 'Ana Lima', total: 'R$ 670,00', status: 'delivered', date: 'Ontem às 18:45' },
    { id: '#1230', customer: 'Carlos Rocha', total: 'R$ 1.200,00', status: 'confirmed', date: 'Ontem às 16:20' }
  ];

  const lowStockProducts = [
    { name: 'Shape Element Cloud', stock: 3, category: 'Shapes' },
    { name: 'Truck Independent 149', stock: 5, category: 'Trucks' },
    { name: 'Rodas Spitfire 53mm', stock: 8, category: 'Rodas' },
    { name: 'Tênis Nike SB', stock: 2, category: 'Calçados' }
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
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
                      <span className="font-semibold text-gray-900">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{order.total}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm font-medium text-dark-600 hover:text-dark-700 transition-colors">
              Ver Todos os Pedidos →
            </button>
          </div>
        </div>

        {/* Low Stock Products */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
