import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Calendar,
  ExternalLink,
  Download,
  ShoppingCart,
} from 'lucide-react';
import { useOrders } from '../context/OrdersContext';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, getStatusLabel, getStatusColor } = useOrders();

  const order = getOrderById(id);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">
                Pedido não encontrado
              </h1>
              <p className="text-gray-600 mb-6">
                O pedido que você está procurando não existe ou foi removido.
              </p>
              <button
                onClick={() => navigate('/pedidos')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar para Meus Pedidos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = getStatusColor(order.status);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',');
  };

  const getTimelineIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return CheckCircle;
      case 'processing':
        return Package;
      case 'shipped':
        return Truck;
      case 'delivered':
        return CheckCircle;
      default:
        return Package;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/pedidos')}
          className="flex items-center gap-2 text-gray-600 hover:text-dark-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Voltar para Meus Pedidos</span>
        </button>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2">
                Pedido {order.id}
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Pedido realizado em {formatDate(order.date)}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-lg text-sm font-semibold border inline-flex items-center gap-2 ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}
            >
              <Package className="w-4 h-4" />
              {getStatusLabel(order.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6" />
                Rastreamento do Pedido
              </h2>

              {/* Timeline Items */}
              <div className="relative">
                {order.timeline.map((event, index) => {
                  const Icon = getTimelineIcon(event.status);
                  const isLast = index === order.timeline.length - 1;
                  const isActive = index === order.timeline.length - 1;

                  return (
                    <div key={index} className="relative pl-8 pb-8 last:pb-0">
                      {/* Line */}
                      {!isLast && (
                        <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200"></div>
                      )}

                      {/* Icon */}
                      <div
                        className={`absolute left-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          isActive
                            ? 'bg-dark-900 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div>
                        <p className={`font-semibold ${isActive ? 'text-dark-900' : 'text-gray-700'}`}>
                          {event.description}
                        </p>
                        <p className="text-sm text-gray-500">{formatDateTime(event.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tracking Code */}
              {order.tracking && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Código de Rastreamento</p>
                      <p className="font-mono font-semibold text-gray-900">{order.tracking.code}</p>
                      <p className="text-xs text-gray-500 mt-1">Transportadora: {order.tracking.carrier}</p>
                    </div>
                    {order.tracking.url && (
                      <a
                        href={order.tracking.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline inline-flex items-center gap-2"
                      >
                        Rastrear
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                Itens do Pedido
              </h2>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantidade: {item.quantity}
                        {item.size && ` • Tamanho: ${item.size}`}
                        {item.color && ` • Cor: ${item.color}`}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                      R$ {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">R$ {formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-dark-700 font-medium">
                    {order.shipping.cost === 0 ? 'GRÁTIS' : `R$ ${formatPrice(order.shipping.cost)}`}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span className="text-gray-900">Total</span>
                  <span className="text-dark-900">R$ {formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Endereço de Entrega
              </h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{order.shipping.address.street}</p>
                {order.shipping.address.complement && <p>{order.shipping.address.complement}</p>}
                <p>{order.shipping.address.neighborhood}</p>
                <p>
                  {order.shipping.address.city} - {order.shipping.address.state}
                </p>
                <p>CEP: {order.shipping.address.zipCode}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Método de Envio</p>
                <p className="font-semibold text-gray-900">{order.shipping.method}</p>
                {order.shipping.estimatedDelivery && (
                  <p className="text-xs text-gray-500 mt-1">
                    Previsão: {formatDate(order.shipping.estimatedDelivery)}
                  </p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Forma de Pagamento
              </h2>
              <div className="text-sm text-gray-600">
                <p className="font-semibold text-gray-900 mb-2">{order.payment.method}</p>
                {order.payment.cardBrand && (
                  <p className="text-gray-500">
                    {order.payment.cardBrand} final {order.payment.lastDigits}
                  </p>
                )}
                {order.payment.installments && (
                  <p className="text-gray-500 mt-1">
                    {order.payment.installments}x de R${' '}
                    {formatPrice(order.total / order.payment.installments)}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Ações
              </h2>
              <div className="space-y-3">
                <button className="w-full btn-outline flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Baixar Nota Fiscal
                </button>
                {order.status === 'delivered' && (
                  <Link to="/produtos" className="w-full btn-primary flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Comprar Novamente
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
