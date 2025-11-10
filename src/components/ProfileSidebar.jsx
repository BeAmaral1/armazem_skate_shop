import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, MapPin, Lock, Heart, Package, Tag, Bell, Eye, Gift } from 'lucide-react';

const ProfileSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Minha Conta',
      path: '/perfil',
      icon: User,
      description: 'Dados pessoais',
    },
    {
      name: 'Meus Pedidos',
      path: '/pedidos',
      icon: Package,
      description: 'Histórico de compras',
    },
    {
      name: 'Meus Cupons',
      path: '/cupons',
      icon: Tag,
      description: 'Cupons de desconto',
    },
    {
      name: 'Indicar Amigos',
      path: '/indicar-amigos',
      icon: Gift,
      description: 'Ganhe R$ 20 por indicação',
    },
    {
      name: 'Notificações',
      path: '/notificacoes',
      icon: Bell,
      description: 'Acompanhar notificações',
    },
    {
      name: 'Endereços',
      path: '/perfil/enderecos',
      icon: MapPin,
      description: 'Gerenciar endereços',
    },
    {
      name: 'Alterar Senha',
      path: '/perfil/senha',
      icon: Lock,
      description: 'Segurança da conta',
    },
    {
      name: 'Favoritos',
      path: '/favoritos',
      icon: Heart,
      description: 'Produtos salvos',
    },
    {
      name: 'Vistos Recentemente',
      path: '/perfil/vistos-recentemente',
      icon: Eye,
      description: 'Histórico de visualizações',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                ${active
                  ? 'bg-dark-900 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${active ? 'text-white' : 'text-gray-900'}`}>
                  {item.name}
                </p>
                <p className={`text-xs ${active ? 'text-gray-200' : 'text-gray-500'} truncate`}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileSidebar;
