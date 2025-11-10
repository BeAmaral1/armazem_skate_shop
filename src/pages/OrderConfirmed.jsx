import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Mail } from 'lucide-react';

const OrderConfirmed = () => {
  const orderNumber = Math.floor(Math.random() * 1000000);

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 sm:mb-6">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-dark-700" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-4">
            Pedido Confirmado!
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Obrigado pela sua compra! Seu pedido foi confirmado com sucesso.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">Número do Pedido</p>
            <p className="text-xl sm:text-2xl font-bold text-dark-600">#{orderNumber}</p>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-left">
            <div className="flex items-start gap-3">
              <Mail className="w-6 h-6 text-dark-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Confirmação enviada</h3>
                <p className="text-gray-600 text-sm">
                  Enviamos um e-mail com os detalhes do seu pedido
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-6 h-6 text-dark-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Preparando envio</h3>
                <p className="text-gray-600 text-sm">
                  Seu pedido será enviado em até 2 dias úteis
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/produtos" className="btn-primary flex-1">
              Continuar Comprando
            </Link>
            <Link to="/" className="btn-outline flex-1">
              Voltar para Início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmed;
