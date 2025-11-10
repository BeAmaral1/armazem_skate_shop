import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Package,
  Tag,
  Star,
  Heart,
  X,
  Check,
  Trash2,
  Filter,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';
import ProfileSidebar from '../components/ProfileSidebar';

const Notifications = () => {
  const {
    getAllNotifications,
    getUnreadNotifications,
    getByType,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    clearRead,
    getRelativeTime,
    simulateNotification,
  } = useNotifications();

  const [filter, setFilter] = useState('all'); // all, unread, order, promotion, review, wishlist, system
  const [showActions, setShowActions] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const allNotifications = getAllNotifications();
  const unreadNotifications = getUnreadNotifications();

  // Aplicar filtro
  const getFilteredNotifications = () => {
    if (filter === 'all') return allNotifications;
    if (filter === 'unread') return unreadNotifications;
    return getByType(filter);
  };

  const filteredNotifications = getFilteredNotifications();

  const getIcon = (iconName) => {
    const icons = {
      Package,
      Tag,
      Star,
      Heart,
      Bell,
    };
    return icons[iconName] || Bell;
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        icon: 'bg-blue-500',
        border: 'border-blue-300',
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        icon: 'bg-green-500',
        border: 'border-green-300',
      },
      yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        icon: 'bg-yellow-500',
        border: 'border-yellow-300',
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        icon: 'bg-red-500',
        border: 'border-red-300',
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        icon: 'bg-purple-500',
        border: 'border-purple-300',
      },
    };
    return colors[color] || colors.blue;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const filters = [
    { value: 'all', label: 'Todas', count: allNotifications.length },
    { value: 'unread', label: 'Não Lidas', count: unreadNotifications.length },
    { value: 'order', label: 'Pedidos', count: getByType('order').length },
    { value: 'promotion', label: 'Promoções', count: getByType('promotion').length },
    { value: 'review', label: 'Avaliações', count: getByType('review').length },
    { value: 'wishlist', label: 'Wishlist', count: getByType('wishlist').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Bell className="w-8 h-8" />
                Notificações
              </h1>
              <p className="text-gray-600">
                Acompanhe todas as suas notificações em um só lugar
              </p>
            </div>
            <button
              onClick={simulateNotification}
              className="px-4 py-2 bg-dark-900 text-white rounded-lg text-sm font-medium hover:bg-dark-950 transition-colors"
            >
              Simular Notificação
            </button>
          </div>
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">Filtros</span>
                </div>
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="text-sm text-dark-700 hover:text-dark-900 font-medium"
                >
                  {showActions ? 'Ocultar' : 'Ações'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
                {filters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    className={`p-2 rounded-lg border-2 transition-all text-center ${
                      filter === f.value
                        ? 'border-dark-900 bg-dark-900 text-white'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <p className="text-xs font-medium mb-1">{f.label}</p>
                    <p
                      className={`text-lg font-bold ${
                        filter === f.value ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {f.count}
                    </p>
                  </button>
                ))}
              </div>

              {/* Actions */}
              {showActions && filteredNotifications.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="flex items-center gap-2 px-3 py-2 bg-dark-900 text-white rounded-lg text-sm font-medium hover:bg-dark-950 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Marcar Todas como Lidas
                    </button>
                  )}
                  {allNotifications.some((n) => n.read) && (
                    <button
                      onClick={clearRead}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar Lidas
                    </button>
                  )}
                  {allNotifications.length > 0 && (
                    <button
                      onClick={() => setShowClearModal(true)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Limpar Todas
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Notifications List */}
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma notificação
                </h3>
                <p className="text-gray-600">
                  {filter === 'all'
                    ? 'Você não tem notificações no momento'
                    : `Nenhuma notificação ${
                        filter === 'unread' ? 'não lida' : `de ${filter}`
                      }`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const Icon = getIcon(notification.icon);
                  const colors = getColorClasses(notification.color);

                  return (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-xl border-2 ${
                        notification.read ? 'border-gray-200' : colors.border
                      } overflow-hidden hover:shadow-lg transition-all ${
                        !notification.read ? colors.bg : ''
                      }`}
                    >
                      <div className="flex items-start gap-4 p-4">
                        {/* Icon */}
                        <div
                          className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Link
                              to={notification.link}
                              onClick={() => handleNotificationClick(notification)}
                              className="flex-1"
                            >
                              <h4 className="font-bold text-gray-900 mb-1 hover:text-dark-700 transition-colors">
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {notification.message}
                              </p>
                            </Link>
                            {!notification.read && (
                              <div
                                className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1"
                                title="Não lida"
                              />
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500">
                              {getRelativeTime(notification.createdAt)}
                            </span>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 hover:bg-green-100 rounded transition-colors"
                                  title="Marcar como lida"
                                >
                                  <Check className="w-4 h-4 text-gray-400 hover:text-green-600" />
                                </button>
                              )}
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="p-1 hover:bg-red-100 rounded transition-colors"
                                title="Remover"
                              >
                                <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                              </button>
                            </div>
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

      {/* Modal de Confirmação */}
      {showClearModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 animate-fadeIn"
            onClick={() => setShowClearModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Limpar Notificações?
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Esta ação não pode ser desfeita
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  Você está prestes a remover <strong className="text-gray-900">{allNotifications.length} {allNotifications.length === 1 ? 'notificação' : 'notificações'}</strong>.
                  Deseja continuar?
                </p>
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                  <Bell className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Todas as notificações serão removidas permanentemente.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    clearAll();
                    setShowClearModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpar Todas
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
