import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para gerenciar ações que requerem autenticação
 * Retorna função que verifica se usuário está logado
 * Se não estiver, mostra modal de autenticação
 */
export const useAuthRequired = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  /**
   * Executa ação se usuário estiver logado
   * Caso contrário, mostra modal de autenticação
   * 
   * @param {Function} action - Ação a ser executada
   * @param {string} message - Mensagem customizada para o modal
   * @param {string} redirectTo - Opcional: redireciona para página específica se logado
   */
  const requireAuth = (action, message = 'Você precisa estar logado para acessar este recurso', redirectTo = null) => {
    if (user) {
      if (redirectTo) {
        navigate(redirectTo);
      } else if (action) {
        action();
      }
    } else {
      setAuthMessage(message);
      setShowAuthModal(true);
    }
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthMessage('');
  };

  return {
    requireAuth,
    showAuthModal,
    authMessage,
    closeAuthModal,
    isAuthenticated: !!user
  };
};
