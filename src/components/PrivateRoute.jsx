import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const [waitingForContext, setWaitingForContext] = useState(false);

  // Se user for null mas há dados no storage, aguardar um momento
  useEffect(() => {
    if (!user && !loading) {
      const hasStoredData = localStorage.getItem('user');
      if (hasStoredData) {
        setWaitingForContext(true);
        
        // Aguardar 300ms para o contexto atualizar
        const timer = setTimeout(() => {
          setWaitingForContext(false);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    } else if (user) {
      setWaitingForContext(false);
    }
  }, [user, loading]);

  // Mostrar loading enquanto verifica autenticação OU aguardando contexto
  if (loading || waitingForContext) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-dark-900"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se requerer uma role específica, verifica permissões (SUPER_ADMIN também pode acessar rotas de ADMIN)
  if (requiredRole) {
    const role = user?.role;
    const hasAccess = role === requiredRole || (requiredRole === 'ADMIN' && role === 'SUPER_ADMIN');
    if (!hasAccess) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
            <p className="text-gray-600 mb-6">
              Você não tem permissão para acessar esta área.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-dark-600 text-white rounded-lg hover:bg-dark-700"
            >
              Voltar para Home
            </a>
          </div>
        </div>
      );
    }
  }

  // Se estiver autenticado e tiver a role necessária, renderiza o componente
  return children;
};

export default PrivateRoute;
