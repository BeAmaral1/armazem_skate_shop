import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, ArrowLeft, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const OrderTracking = () => {
  const { user } = useAuth();
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular busca de rastreamento
    setTimeout(() => {
      setTrackingResult({
        code: trackingCode,
        status: 'em_transito',
        estimatedDate: '15/11/2025',
        events: [
          {
            date: '10/11/2025 14:30',
            status: 'Pedido saiu para entrega',
            location: 'Centro de Distribuição - São Paulo, SP'
          },
          {
            date: '09/11/2025 10:15',
            status: 'Objeto em trânsito',
            location: 'Unidade de Tratamento - São Paulo, SP'
          },
          {
            date: '08/11/2025 16:45',
            status: 'Objeto postado',
            location: 'Agência dos Correios - São Paulo, SP'
          }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 md:py-12">
      <SEO 
        title="Rastreio de Pedidos - Armazém Skate Shop"
        description="Rastreie seu pedido em tempo real"
      />
      
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-2 text-dark-600 hover:text-dark-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar para Home</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-dark-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-dark-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark-900 leading-tight">Rastreio de Pedidos</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Acompanhe seu pedido em tempo real</p>
            </div>
          </div>

          {/* Formulário de Rastreamento */}
          <form onSubmit={handleTrack} className="mt-4 sm:mt-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Código de rastreamento"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                className="flex-1 w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-600"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-dark-900 text-white rounded-lg hover:bg-dark-950 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Rastrear
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Resultado do Rastreamento */}
        {trackingResult && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="border-l-4 border-dark-600 pl-3 sm:pl-4 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-dark-900 break-all">Código: {trackingResult.code}</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Previsão: {trackingResult.estimatedDate}</p>
            </div>

            {/* Status Visual */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 relative px-2">
              <div className="absolute top-4 sm:top-5 left-0 right-0 h-0.5 sm:h-1 bg-gray-200 mx-8 sm:mx-0">
                <div className="h-full bg-dark-600" style={{ width: '66%' }}></div>
              </div>
              
              <div className="relative flex flex-col items-center gap-1 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white z-10">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-xs mt-1 text-center leading-tight">Postado</span>
              </div>
              
              <div className="relative flex flex-col items-center gap-1 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-dark-600 rounded-full flex items-center justify-center text-white z-10">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-xs mt-1 text-center leading-tight">Em Trânsito</span>
              </div>
              
              <div className="relative flex flex-col items-center gap-1 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 z-10">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-xs mt-1 text-center leading-tight">Entregue</span>
              </div>
            </div>

            {/* Histórico */}
            <h3 className="text-base sm:text-lg font-bold text-dark-900 mb-3 sm:mb-4">Histórico de Movimentação</h3>
            <div className="space-y-3 sm:space-y-4">
              {trackingResult.events.map((event, index) => (
                <div key={index} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200 last:border-0">
                  <div className="flex-shrink-0 w-2 h-2 bg-dark-600 rounded-full mt-1.5 sm:mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-dark-900">{event.status}</p>
                    <p className="text-xs sm:text-sm text-gray-600 break-words">{event.location}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Para usuários logados */}
        {user && (
          <div className="bg-dark-100 rounded-xl p-4 sm:p-6 text-center">
            <h3 className="text-lg sm:text-xl font-bold text-dark-900 mb-2 sm:mb-3">Veja todos os seus pedidos</h3>
            <p className="text-sm text-gray-600 mb-3 sm:mb-4">Acesse seu histórico completo de compras</p>
            <Link 
              to="/pedidos"
              className="inline-flex items-center justify-center gap-2 bg-dark-900 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-dark-950 transition-colors text-sm font-medium"
            >
              <Package className="w-5 h-5" />
              Meus Pedidos
            </Link>
          </div>
        )}

        {/* Informações */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mt-4 sm:mt-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-dark-900 mb-3 sm:mb-4">Sobre o Rastreamento</h2>
          <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-gray-700">
            <p>
              <strong>Onde encontrar o código?</strong><br />
              O código de rastreamento é enviado por email assim que seu pedido é postado.
            </p>
            <p>
              <strong>Quando começa o rastreamento?</strong><br />
              O rastreamento fica disponível 24-48h após a postagem.
            </p>
            <p>
              <strong>Problemas com a entrega?</strong><br />
              Entre em contato: atendimento@armazemskate.com.br ou WhatsApp (11) 99999-9999
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
