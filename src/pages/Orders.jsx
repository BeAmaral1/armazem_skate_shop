import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, CreditCard, Truck, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import { useOrders } from '../context/OrdersContext';
import ProfileSidebar from '../components/ProfileSidebar';

const Orders = () => {
  const { orders, loading, getOrdersByStatus, getOrdersCount, getStatusLabel, getStatusColor } = useOrders();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const counts = getOrdersCount();
  const filteredOrders = getOrdersByStatus(selectedFilter);

  const filters = [
    { value: 'all', label: 'Todos', count: counts.all, icon: Package },
    { value: 'processing', label: 'Processando', count: counts.processing, icon: Clock },
    { value: 'shipped', label: 'Enviado', count: counts.shipped, icon: Truck },
    { value: 'delivered', label: 'Entregue', count: counts.delivered, icon: CheckCircle },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-dark-900 mb-4"></div>
          <p className="text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Package className="w-8 h-8" />
            Meus Pedidos
          </h1>
          <p className="text-gray-600">
            Acompanhe o status de todos os seus pedidos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Filtrar por Status</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.value}
                      onClick={() => setSelectedFilter(filter.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedFilter === filter.value
                          ? 'border-dark-900 bg-dark-900 text-white'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${
                        selectedFilter === filter.value ? 'text-white' : 'text-gray-500'
                      }`} />
                      <p className="text-xs font-medium">{filter.label}</p>
                      <p className={`text-sm font-bold ${
                        selectedFilter === filter.value ? 'text-white' : 'text-gray-900'
                      }`}>
                        {filter.count}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedFilter === 'all'
                    ? 'Você ainda não fez nenhum pedido'
                    : `Você não tem pedidos com status "${filters.find(f => f.value === selectedFilter)?.label}"`}
                </p>
                <Link to="/produtos" className="btn-primary inline-flex items-center gap-2">
                  Explorar Produtos
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const statusColor = getStatusColor(order.status);
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Header */}
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-dark-900 rounded-lg flex items-center justify-center">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{order.id}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(order.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-6">
                        {/* Items */}
                        <div className="space-y-3 mb-4">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                  Quantidade: {item.quantity}
                                  {item.size && ` • Tamanho: ${item.size}`}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900 whitespace-nowrap">
                                R$ {formatPrice(item.price)}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Truck className="w-4 h-4" />
                              <span>{order.shipping.method}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <CreditCard className="w-4 h-4" />
                              <span>{order.payment.method}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="text-xl font-bold text-dark-900">
                                R$ {formatPrice(order.total)}
                              </p>
                            </div>
                            <Link
                              to={`/pedidos/${order.id}`}
                              className="btn-primary flex items-center gap-2"
                            >
                              Ver Detalhes
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
