import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Waves, Heart, LogOut, ChevronDown, Package, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const categoriesMenuRef = useRef(null);
  const categoriesButtonRef = useRef(null);
  const [categoriesDropdownPosition, setCategoriesDropdownPosition] = useState({ top: 0, left: 0 });

  // Calcular posição do dropdown de usuário
  useEffect(() => {
    if (isUserMenuOpen && userButtonRef.current) {
      const rect = userButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [isUserMenuOpen]);

  // Calcular posição do dropdown de categorias
  useEffect(() => {
    if (isCategoriesOpen && categoriesButtonRef.current) {
      const rect = categoriesButtonRef.current.getBoundingClientRect();
      setCategoriesDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
  }, [isCategoriesOpen]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(event.target) &&
          categoriesButtonRef.current && !categoriesButtonRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
        setOpenSubCategory(null);
      }
    };

    if (isUserMenuOpen || isCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUserMenuOpen, isCategoriesOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Produtos', path: '/produtos' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Contato', path: '/contato' }
  ];

  // Estrutura de Categorias e Subcategorias
  const categories = [
    {
      name: 'Acessórios',
      path: '/produtos?categoria=acessorios',
      subcategories: [
        { name: 'Óculos', path: '/produtos?categoria=acessorios&sub=oculos' },
        { name: 'Tocas', path: '/produtos?categoria=acessorios&sub=tocas' },
        { name: 'Relógios', path: '/produtos?categoria=acessorios&sub=relogios' },
        { name: 'Correntes', path: '/produtos?categoria=acessorios&sub=correntes' },
        { name: 'Bonés', path: '/produtos?categoria=acessorios&sub=bones' }
      ]
    },
    {
      name: 'Roupas',
      path: '/produtos?categoria=roupas',
      subcategories: [
        { name: 'Camisetas', path: '/produtos?categoria=roupas&sub=camisetas' },
        { name: 'Camisa Longa', path: '/produtos?categoria=roupas&sub=camisa-longa' },
        { name: 'Moletons', path: '/produtos?categoria=roupas&sub=moletons' },
        { name: 'Regatas', path: '/produtos?categoria=roupas&sub=regatas' }
      ]
    },
    {
      name: 'Tênis',
      path: '/produtos?categoria=tenis',
      subcategories: [
        { name: 'Confecção Masculina', path: '/produtos?categoria=tenis&sub=masculino' },
        { name: 'Confecção Feminina', path: '/produtos?categoria=tenis&sub=feminino' }
      ]
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/produtos?busca=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-[60]">
      {/* Top bar */}
      <div className="bg-dark-950 text-white py-2 px-4 text-xs sm:text-sm text-center">
        <p className="hidden sm:block">Frete grátis para compras acima de R$ 299 | Parcele em até 10x sem juros</p>
        <p className="sm:hidden">Frete grátis acima de R$ 299</p>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-3 md:px-4 lg:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <img 
              src="/logo_armazem.png" 
              alt="Armazem Skate Shop" 
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-base md:text-xl lg:text-2xl font-logo font-bold text-dark-900 uppercase tracking-wide leading-none">
                Armazém
              </h1>
              <p className="text-[10px] md:text-xs lg:text-sm text-dark-600 font-semibold tracking-wider leading-none mt-0.5">
                SKATE SHOP
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium text-sm lg:text-base transition-colors ${
                  isActive(link.path)
                    ? 'text-dark-900 border-b-2 border-dark-900'
                    : 'text-gray-700 hover:text-dark-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Dropdown Categorias */}
            <div className="relative" ref={categoriesMenuRef}>
              <button
                ref={categoriesButtonRef}
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-1 font-medium text-sm lg:text-base text-gray-700 hover:text-dark-900 transition-colors"
              >
                Categorias
                <ChevronDown className={`w-4 h-4 transition-transform ${
                  isCategoriesOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
            </div>
          </nav>

          {/* Mega Menu Dropdown - Fora do nav para não ser cortado */}
          {isCategoriesOpen && (
            <>
              {/* Overlay transparente */}
              <div 
                className="fixed inset-0 z-[90] bg-transparent"
                onClick={() => {
                  setIsCategoriesOpen(false);
                  setOpenSubCategory(null);
                }}
              />
              
              {/* Dropdown */}
              <div 
                className="fixed w-72 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-[100] animate-fadeIn"
                style={{
                  top: `${categoriesDropdownPosition.top}px`,
                  left: `${categoriesDropdownPosition.left}px`
                }}
                ref={categoriesMenuRef}
              >
                  <div className="p-2">
                    {categories.map((category, index) => (
                      <div key={category.name} className="relative">
                        {/* Categoria Principal */}
                        <button
                          onClick={() => {
                            if (openSubCategory === index) {
                              setOpenSubCategory(null);
                            } else {
                              setOpenSubCategory(index);
                            }
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-gray-900 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <span className="group-hover:text-dark-900">{category.name}</span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                            openSubCategory === index ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        {/* Subcategorias */}
                        {openSubCategory === index && (
                          <div className="ml-4 pl-4 border-l-2 border-gray-200 space-y-1 animate-slideDown">
                            <Link
                              to={category.path}
                              onClick={() => {
                                setIsCategoriesOpen(false);
                                setOpenSubCategory(null);
                              }}
                              className="block px-4 py-2 text-sm text-dark-900 font-medium hover:bg-dark-50 rounded-lg transition-colors"
                            >
                              Ver Todos
                            </Link>
                            {category.subcategories.map(sub => (
                              <Link
                                key={sub.name}
                                to={sub.path}
                                onClick={() => {
                                  setIsCategoriesOpen(false);
                                  setOpenSubCategory(null);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-dark-900 rounded-lg transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Footer do Mega Menu */}
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <Link
                      to="/produtos"
                      onClick={() => {
                        setIsCategoriesOpen(false);
                        setOpenSubCategory(null);
                      }}
                      className="text-sm font-semibold text-dark-900 hover:text-dark-700 flex items-center gap-1"
                    >
                      Ver Todos os Produtos
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </Link>
                  </div>
              </div>
            </>
          )}

          {/* Right Icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              {isSearchOpen ? (
                <div className="flex items-center">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar..."
                      className="w-32 md:w-40 lg:w-64 px-3 md:px-4 py-1.5 md:py-2 pr-8 md:pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-dark-600 text-xs md:text-sm"
                      autoFocus
                      onBlur={() => {
                        if (!searchTerm) {
                          setTimeout(() => setIsSearchOpen(false), 200);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      className="absolute right-1 md:right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Search className="w-4 h-4 md:w-5 md:h-5 text-dark-900" />
                    </button>
                  </form>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Buscar"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/favoritos" className="relative p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors" title="Favoritos">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-dark-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            {isAuthenticated() && <NotificationBell />}

            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  ref={userButtonRef}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 md:gap-2 p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  id="user-menu-button"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-dark-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs md:text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="hidden lg:block w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div 
                    className="fixed w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[100]"
                    style={{ 
                      top: `${dropdownPosition.top}px`,
                      right: `${dropdownPosition.right}px`,
                      maxWidth: 'calc(100vw - 2rem)' 
                    }}>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/perfil"
                      onClick={() => setTimeout(() => setIsUserMenuOpen(false), 100)}
                      className="flex items-center gap-3 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      Minha Conta
                    </Link>
                    <Link
                      to="/pedidos"
                      onClick={() => setTimeout(() => setIsUserMenuOpen(false), 100)}
                      className="flex items-center gap-3 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Package className="w-5 h-5" />
                      Meus Pedidos
                    </Link>
                    <Link
                      to="/favoritos"
                      onClick={() => setTimeout(() => setIsUserMenuOpen(false), 100)}
                      className="flex items-center gap-3 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      Meus Favoritos
                    </Link>
                    <Link
                      to="/perfil/vistos-recentemente"
                      onClick={() => setTimeout(() => setIsUserMenuOpen(false), 100)}
                      className="flex items-center gap-3 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                      Vistos Recentemente
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors" title="Entrar">
                <User className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              </Link>
            )}

            {/* Cart */}
            <Link to="/carrinho" className="relative p-1.5 md:p-2 hover:bg-gray-100 rounded-full transition-colors" title="Carrinho">
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-dark-900 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden mt-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-dark-600 text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-dark-900" />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium py-2 px-4 rounded transition-colors ${
                    isActive(link.path)
                      ? 'bg-gray-100 text-dark-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Categorias Mobile */}
              <div className="border-t pt-3 mt-3">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Categorias
                </div>
                {categories.map((category, index) => (
                  <div key={category.name} className="mb-2">
                    {/* Categoria Principal */}
                    <button
                      onClick={() => {
                        if (openSubCategory === index) {
                          setOpenSubCategory(null);
                        } else {
                          setOpenSubCategory(index);
                        }
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-left font-semibold text-gray-900 hover:bg-gray-50 rounded transition-colors"
                    >
                      <span>{category.name}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                        openSubCategory === index ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {/* Subcategorias */}
                    {openSubCategory === index && (
                      <div className="ml-6 mt-1 space-y-1 animate-slideDown">
                        <Link
                          to={category.path}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setOpenSubCategory(null);
                          }}
                          className="block px-4 py-2 text-sm text-dark-900 font-medium hover:bg-dark-50 rounded transition-colors"
                        >
                          Ver Todos
                        </Link>
                        {category.subcategories.map(sub => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setOpenSubCategory(null);
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
