import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationsContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};

// Dados mockados de notificações
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'order', // order, promotion, review, wishlist, system
    title: 'Pedido Enviado',
    message: 'Seu pedido #1001 foi enviado e está a caminho!',
    link: '/pedidos/1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
    icon: 'Package',
    color: 'blue',
  },
  {
    id: 2,
    type: 'promotion',
    title: 'Nova Promoção!',
    message: 'Produtos da sua wishlist com até 30% OFF. Aproveite!',
    link: '/favoritos',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h atrás
    icon: 'Tag',
    color: 'green',
  },
  {
    id: 3,
    type: 'review',
    title: 'Avalie seu Produto',
    message: 'Que tal avaliar a Prancha de Surf Pro que você comprou?',
    link: '/produto/1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5h atrás
    icon: 'Star',
    color: 'yellow',
  },
  {
    id: 4,
    type: 'order',
    title: 'Pedido Entregue',
    message: 'Seu pedido #1000 foi entregue com sucesso!',
    link: '/pedidos/1000',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    icon: 'Package',
    color: 'blue',
  },
  {
    id: 5,
    type: 'wishlist',
    title: 'Produto de Volta ao Estoque',
    message: 'Shape Profissional voltou ao estoque. Não perca!',
    link: '/produto/2',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 dias atrás
    icon: 'Heart',
    color: 'red',
  },
  {
    id: 6,
    type: 'system',
    title: 'Bem-vindo!',
    message: 'Obrigado por se cadastrar. Aproveite 15% OFF na primeira compra com o cupom PRIMEIRACOMPRA',
    link: '/cupons',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 dias atrás
    icon: 'Bell',
    color: 'purple',
  },
];

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  // Carregar notificações do localStorage
  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        // Converter strings de data de volta para objetos Date
        const withDates = parsed.map((n) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }));
        setNotifications(withDates);
      } else {
        // Primeira vez, usar notificações mockadas
        setNotifications(MOCK_NOTIFICATIONS);
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(MOCK_NOTIFICATIONS));
      }
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Salvar notificações no localStorage
  const saveNotifications = (notifs) => {
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifs));
      setNotifications(notifs);
    }
  };

  // Buscar todas as notificações
  const getAllNotifications = () => {
    return notifications.sort((a, b) => b.createdAt - a.createdAt);
  };

  // Buscar notificações não lidas
  const getUnreadNotifications = () => {
    return notifications.filter((n) => !n.read).sort((a, b) => b.createdAt - a.createdAt);
  };

  // Contar notificações não lidas
  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  // Marcar como lida
  const markAsRead = (notificationId) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  // Marcar todas como lidas
  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  // Adicionar nova notificação
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      read: false,
      createdAt: new Date(),
      ...notification,
    };
    const updated = [newNotification, ...notifications];
    saveNotifications(updated);
    return newNotification;
  };

  // Remover notificação
  const removeNotification = (notificationId) => {
    const updated = notifications.filter((n) => n.id !== notificationId);
    saveNotifications(updated);
  };

  // Limpar todas as notificações
  const clearAll = () => {
    saveNotifications([]);
  };

  // Limpar notificações lidas
  const clearRead = () => {
    const updated = notifications.filter((n) => !n.read);
    saveNotifications(updated);
  };

  // Formatar tempo relativo
  const getRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      });
    } else if (days > 0) {
      return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    } else if (hours > 0) {
      return `${hours}h atrás`;
    } else if (minutes > 0) {
      return `${minutes}min atrás`;
    } else {
      return 'Agora';
    }
  };

  // Buscar por tipo
  const getByType = (type) => {
    return notifications
      .filter((n) => n.type === type)
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  // Simular nova notificação (para testes)
  const simulateNotification = () => {
    const types = ['order', 'promotion', 'review', 'wishlist', 'system'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const templates = {
      order: {
        title: 'Atualização de Pedido',
        message: 'Seu pedido foi atualizado!',
        icon: 'Package',
        color: 'blue',
        link: '/pedidos',
      },
      promotion: {
        title: 'Oferta Especial',
        message: 'Produtos selecionados com desconto!',
        icon: 'Tag',
        color: 'green',
        link: '/produtos',
      },
      review: {
        title: 'Deixe sua Avaliação',
        message: 'O que achou do produto?',
        icon: 'Star',
        color: 'yellow',
        link: '/pedidos',
      },
      wishlist: {
        title: 'Produto em Promoção',
        message: 'Item da sua wishlist está em oferta!',
        icon: 'Heart',
        color: 'red',
        link: '/favoritos',
      },
      system: {
        title: 'Notificação do Sistema',
        message: 'Novidades no site!',
        icon: 'Bell',
        color: 'purple',
        link: '/',
      },
    };

    return addNotification({
      type: randomType,
      ...templates[randomType],
    });
  };

  const value = {
    notifications,
    getAllNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAll,
    clearRead,
    getRelativeTime,
    getByType,
    simulateNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
};
