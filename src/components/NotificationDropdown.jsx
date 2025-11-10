import React, { useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const {
    getUnreadNotifications,
    getAllNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearRead,
    getRelativeTime,
  } = useNotifications();

  const dropdownRef = useRef(null);
  const [showAll, setShowAll] = React.useState(false);

  const unreadNotifications = getUnreadNotifications();
  const allNotifications = getAllNotifications();
  const displayNotifications = showAll ? allNotifications : unreadNotifications;

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      },
      green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        icon: 'bg-green-500',
      },
      yellow: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        icon: 'bg-yellow-500',
      },
      red: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        icon: 'bg-red-500',
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
        icon: 'bg-purple-500',
      },
    };
    return colors[color] || colors.blue;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    onClose();
  };

  const handleRemove = (e, notificationId) => {
    e.preventDefault();
    e.stopPropagation();
    removeNotification(notificationId);
  };

  return (
    <>
      {/* Overlay escuro */}
      <div 
        className="fixed inset-0 bg-black/30 z-[9998] animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className="fixed top-16 left-1/2 -translate-x-1/2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[9999] animate-fadeIn"
        style={{ maxWidth: 'calc(100vw - 2rem)' }}
      >
      {/* Header */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAll(false)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
              !showAll
                ? 'bg-dark-900 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="hidden sm:inline">Não Lidas</span>
            <span className="sm:hidden">Não Lidas</span> ({unreadNotifications.length})
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
              showAll
                ? 'bg-dark-900 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas ({allNotifications.length})
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[70vh] sm:max-h-96 overflow-y-auto">
        {displayNotifications.length === 0 ? (
          <div className="px-3 sm:px-4 py-8 sm:py-12 text-center">
            <Bell className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              {showAll ? 'Nenhuma notificação' : 'Nenhuma notificação não lida'}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Você está em dia!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayNotifications.map((notification) => {
              const Icon = getIcon(notification.icon);
              const colors = getColorClasses(notification.color);

              return (
                <Link
                  key={notification.id}
                  to={notification.link}
                  onClick={() => handleNotificationClick(notification)}
                  className={`block px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 transition-colors relative ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    {/* Icon */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.icon} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1">
                        <p className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-0.5 sm:mt-1" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-1.5 sm:mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs text-gray-400">
                          {getRelativeTime(notification.createdAt)}
                        </span>
                        <button
                          onClick={(e) => handleRemove(e, notification.id)}
                          className="p-0.5 sm:p-1 hover:bg-red-100 rounded transition-colors"
                          title="Remover"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {displayNotifications.length > 0 && (
        <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {!showAll && unreadNotifications.length > 0 && (
              <button
                onClick={() => {
                  markAllAsRead();
                }}
                className="flex-1 py-2 px-2 sm:px-3 bg-dark-900 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-dark-950 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Marcar Todas como Lidas</span>
                <span className="sm:hidden">Marcar Lidas</span>
              </button>
            )}
            {showAll && (
              <button
                onClick={clearRead}
                className="flex-1 py-2 px-2 sm:px-3 bg-gray-200 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Limpar Lidas</span>
                <span className="sm:hidden">Limpar</span>
              </button>
            )}
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default NotificationDropdown;
