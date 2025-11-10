import React from 'react';
import { Link } from 'react-router-dom';
import { X, Lock, LogIn, UserPlus } from 'lucide-react';

/**
 * Modal que aparece quando usuário tenta acessar recurso que precisa de autenticação
 */
const AuthRequiredModal = ({ isOpen, onClose, message = "Você precisa estar logado para acessar este recurso" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slide-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-dark-900 to-dark-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Acesso Restrito</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-dark-600" />
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              to="/login"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 bg-dark-900 text-white px-6 py-3 rounded-lg hover:bg-dark-950 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <LogIn className="w-5 h-5" />
              Fazer Login
            </Link>

            <Link
              to="/cadastro"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 border-2 border-dark-900 text-dark-900 px-6 py-3 rounded-lg hover:bg-dark-900 hover:text-white transition-all duration-300 font-semibold"
            >
              <UserPlus className="w-5 h-5" />
              Criar Conta
            </Link>

            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            🔒 Seus dados estão seguros conosco
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
