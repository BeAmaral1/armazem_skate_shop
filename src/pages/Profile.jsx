import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Mail, Phone, CreditCard, Calendar, MapPin, Heart, Package, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileSidebar from '../components/ProfileSidebar';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const stats = [
    {
      icon: Package,
      label: 'Pedidos',
      value: '0',
      color: 'text-dark-700',
      bgColor: 'bg-gray-100',
    },
    {
      icon: Heart,
      label: 'Favoritos',
      value: '0',
      color: 'text-dark-700',
      bgColor: 'bg-gray-100',
    },
    {
      icon: MapPin,
      label: 'Endereços',
      value: '0',
      color: 'text-dark-700',
      bgColor: 'bg-gray-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2">
            Minha Conta
          </h1>
          <p className="text-gray-600">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-dark-800 to-dark-950 p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl sm:text-4xl font-bold text-dark-900">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-1">
                      {user.name}
                    </h2>
                    <p className="text-gray-200 text-sm">Cliente desde {formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-heading font-semibold text-gray-900">
                    Informações Pessoais
                  </h3>
                  <Link
                    to="/perfil/editar"
                    className="flex items-center gap-2 text-sm font-medium text-dark-700 hover:text-dark-900 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Telefone</p>
                        <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.cpf && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">CPF</p>
                        <p className="text-sm font-medium text-gray-900">{user.cpf}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Membro desde</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-4">
                Ações Rápidas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/perfil/enderecos"
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-dark-600 hover:bg-gray-50 transition-all"
                >
                  <MapPin className="w-5 h-5 text-dark-700" />
                  <div>
                    <p className="font-semibold text-gray-900">Endereços</p>
                    <p className="text-xs text-gray-500">Adicionar ou editar</p>
                  </div>
                </Link>

                <Link
                  to="/perfil/senha"
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-dark-600 hover:bg-gray-50 transition-all"
                >
                  <Lock className="w-5 h-5 text-dark-700" />
                  <div>
                    <p className="font-semibold text-gray-900">Alterar Senha</p>
                    <p className="text-xs text-gray-500">Segurança da conta</p>
                  </div>
                </Link>

                <Link
                  to="/favoritos"
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-dark-600 hover:bg-gray-50 transition-all"
                >
                  <Heart className="w-5 h-5 text-dark-700" />
                  <div>
                    <p className="font-semibold text-gray-900">Favoritos</p>
                    <p className="text-xs text-gray-500">Produtos salvos</p>
                  </div>
                </Link>

                <Link
                  to="/produtos"
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-dark-600 hover:bg-gray-50 transition-all"
                >
                  <Package className="w-5 h-5 text-dark-700" />
                  <div>
                    <p className="font-semibold text-gray-900">Continuar Comprando</p>
                    <p className="text-xs text-gray-500">Explorar produtos</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
