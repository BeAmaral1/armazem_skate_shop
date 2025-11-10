import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Number */}
        <h1 className="text-9xl md:text-[12rem] font-bold text-dark-900 mb-4">
          404
        </h1>
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Página não encontrada
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          Desculpe, a página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        
        {/* Divider */}
        <div className="w-24 h-1 bg-dark-900 mx-auto mb-8"></div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Voltar para Home
          </Link>
          
          <Link
            to="/produtos"
            className="btn-outline flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Ver Produtos
          </Link>
        </div>
        
        {/* Back Link */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-dark-900 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para página anterior
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
