import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';
import NotificationDropdown from './NotificationDropdown';

const NotificationBell = () => {
  const { getUnreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = getUnreadCount();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Notificações"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        
        {/* Badge de contador */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default NotificationBell;
