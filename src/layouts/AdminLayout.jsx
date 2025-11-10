import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FileText, 
  Image, 
  HelpCircle, 
  Tag, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Verificar se é admin
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      exact: true
    },
    {
      title: 'Produtos',
      icon: Package,
      path: '/admin/produtos'
    },
    {
      title: 'Pedidos',
      icon: ShoppingCart,
      path: '/admin/pedidos'
    },
    {
      title: 'Clientes',
      icon: Users,
      path: '/admin/clientes'
    },
    {
      title: 'Conteúdo',
      icon: FileText,
      path: '/admin/conteudo'
    },
    {
      title: 'Banners',
      icon: Image,
      path: '/admin/banners'
    },
    {
      title: 'FAQs',
      icon: HelpCircle,
      path: '/admin/faqs'
    },
    {
      title: 'Cupons',
      icon: Tag,
      path: '/admin/cupons'
    },
    {
      title: 'Configurações',
      icon: Settings,
      path: '/admin/configuracoes'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-dark-900 text-white transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-dark-800">
          <Link to="/admin" className="flex items-center gap-2">
            <Package className="w-8 h-8 text-white" />
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${active 
                    ? 'bg-dark-800 text-white' 
                    : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Menu */}
        <div className="border-t border-dark-800 p-4">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-dark-800 rounded-lg shadow-lg overflow-hidden">
                <Link
                  to="/admin/perfil"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-dark-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Meu Perfil</span>
                </Link>
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-dark-700 transition-colors"
                >
                  <Package className="w-4 h-4" />
                  <span className="text-sm">Ver Site</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-dark-700 transition-colors text-left text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 lg:ml-0 ml-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {menuItems.find(item => isActive(item.path, item.exact))?.title || 'Admin'}
            </h1>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Ver Site</span>
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
