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
    <div className="min-h-screen bg-gray-50 py-12">
      <SEO 
        title="Rastreio de Pedidos - Armazém Skate Shop"
        description="Rastreie seu pedido em tempo real"
      />
      
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center gap-2 text-dark-600 hover:text-dark-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar para Home</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-dark-100 rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-dark-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-dark-900">Rastreio de Pedidos</h1>
              <p className="text-gray-600">Acompanhe seu pedido em tempo real</p>
            </div>
          </div>

          {/* Formulário de Rastreamento */}
          <form onSubmit={handleTrack} className="mt-6">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Digite o código de rastreamento (ex: BR123456789BR)"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-600"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-dark-900 text-white rounded-lg hover:bg-dark-950 transition-colors disabled:opacity-50 flex items-center gap-2"
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
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="border-l-4 border-dark-600 pl-4 mb-6">
              <h2 className="text-xl font-bold text-dark-900">Código: {trackingResult.code}</h2>
              <p className="text-gray-600">Previsão de entrega: {trackingResult.estimatedDate}</p>
            </div>

            {/* Status Visual */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div className="h-full bg-dark-600" style={{ width: '66%' }}></div>
              </div>
              
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white z-10">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="text-xs mt-2 text-center">Postado</span>
              </div>
              
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 bg-dark-600 rounded-full flex items-center justify-center text-white z-10">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-xs mt-2 text-center">Em Trânsito</span>
              </div>
              
              <div className="relative flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 z-10">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-xs mt-2 text-center">Entregue</span>
              </div>
            </div>

            {/* Histórico */}
            <h3 className="text-lg font-bold text-dark-900 mb-4">Histórico de Movimentação</h3>
            <div className="space-y-4">
              {trackingResult.events.map((event, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                  <div className="flex-shrink-0 w-2 h-2 bg-dark-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-dark-900">{event.status}</p>
                    <p className="text-sm text-gray-600">{event.location}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Para usuários logados */}
        {user && (
          <div className="bg-dark-100 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-dark-900 mb-3">Veja todos os seus pedidos</h3>
            <p className="text-gray-600 mb-4">Acesse seu histórico completo de compras</p>
            <Link 
              to="/meus-pedidos"
              className="inline-flex items-center gap-2 bg-dark-900 text-white px-6 py-3 rounded-lg hover:bg-dark-950 transition-colors"
            >
              <Package className="w-5 h-5" />
              Meus Pedidos
            </Link>
          </div>
        )}

        {/* Informações */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-6">
          <h2 className="text-2xl font-bold text-dark-900 mb-4">Sobre o Rastreamento</h2>
          <div className="space-y-3 text-gray-700">
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
