import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gift, 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Mail, 
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Award,
  ExternalLink
} from 'lucide-react';
import { useReferral } from '../context/ReferralContext';
import { useAuth } from '../context/AuthContext';

const Referrals = () => {
  const { user } = useAuth();
  const { 
    referralCode, 
    referrals, 
    credits, 
    stats, 
    getReferralLink, 
    getShareMessages 
  } = useReferral();

  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Faça login para indicar amigos</h2>
          <Link to="/login" className="btn-primary">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const message = getShareMessages().whatsapp;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareEmail = () => {
    const { subject, body } = getShareMessages().email;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente', icon: Clock },
      completed: { color: 'bg-blue-100 text-blue-800', text: 'Comprou', icon: CheckCircle },
      credited: { color: 'bg-green-100 text-green-800', text: 'Creditado', icon: DollarSign },
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2">
            Indicar Amigos
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Compartilhe e ganhe R$ 20 de crédito para cada amigo que comprar!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-dark-600" />
              <span className="text-2xl sm:text-3xl font-bold">{stats.totalReferrals}</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">Total de Indicações</p>
          </div>

          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-600" />
              <span className="text-2xl sm:text-3xl font-bold">{stats.pendingReferrals}</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">Aguardando Compra</p>
          </div>

          <div className="card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              <span className="text-2xl sm:text-3xl font-bold">{stats.creditedReferrals}</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">Creditadas</p>
          </div>

          <div className="card p-4 sm:p-6 bg-gradient-to-br from-dark-800 to-dark-900 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-2xl sm:text-3xl font-bold">R$ {credits.toFixed(2)}</span>
            </div>
            <p className="text-gray-200 text-xs sm:text-sm">Créditos Disponíveis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Share Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Share Card */}
            <div className="card p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-12 h-12 bg-dark-100 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-dark-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold">Compartilhe seu código</h2>
                  <p className="text-xs sm:text-sm text-gray-600">Seus amigos ganham 10% de desconto</p>
                </div>
              </div>

              {/* Referral Code */}
              <div className="bg-gradient-to-br from-dark-50 to-dark-100 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Seu código de indicação:</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 bg-white rounded-lg px-4 py-3 border-2 border-dark-300 text-center sm:text-left">
                    <span className="text-xl sm:text-2xl font-bold text-dark-900 tracking-wider break-all">
                      {referralCode}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(referralCode)}
                    className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span className="hidden sm:inline">Copiado!</span>
                        <span className="sm:hidden">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share Link */}
              <div className="mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-2">Link de indicação:</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    value={getReferralLink()}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-xs sm:text-sm truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(getReferralLink())}
                    className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <Copy className="w-5 h-5" />
                    <span className="sm:hidden">Copiar Link</span>
                  </button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <button
                  onClick={shareWhatsApp}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
                
                <button
                  onClick={shareEmail}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </button>
                
                <button
                  onClick={() => copyToClipboard(getShareMessages().copy)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Copiar Mensagem
                </button>
              </div>
            </div>

            {/* Referrals List */}
            <div className="card p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Suas Indicações</h3>
              
              {referrals.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Você ainda não indicou ninguém</p>
                  <p className="text-sm text-gray-500">
                    Compartilhe seu código e comece a ganhar créditos!
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3 sm:gap-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-sm sm:text-base truncate">{referral.referredName || 'Amigo'}</p>
                          {getStatusBadge(referral.status)}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{referral.referredEmail}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Indicado em {new Date(referral.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      
                      {referral.status === 'credited' && (
                        <div className="text-left sm:text-right flex-shrink-0">
                          <p className="text-green-600 font-bold text-sm sm:text-base">
                            +R$ {referral.creditEarned.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">Creditado</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* How it Works */}
            <div className="card p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold mb-4">Como Funciona</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-dark-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Compartilhe seu código</p>
                    <p className="text-xs text-gray-600">Envie para amigos e família</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-dark-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Seu amigo ganha 10%</p>
                    <p className="text-xs text-gray-600">Desconto na primeira compra</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-dark-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">Você ganha R$ 20</p>
                    <p className="text-xs text-gray-600">Crédito para usar em compras</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="card p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                <h3 className="text-base sm:text-lg font-bold text-yellow-900">Benefícios</h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>R$ 20 de crédito por indicação</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Créditos sem validade</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Indicações ilimitadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Use em qualquer compra</span>
                </li>
              </ul>
            </div>

            {/* Ranking Preview */}
            <div className="card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold">Top Indicadores</h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-3">
                {[
                  { name: 'João Silva', referrals: 15, rank: 1 },
                  { name: 'Maria Santos', referrals: 12, rank: 2 },
                  { name: 'Pedro Costa', referrals: 10, rank: 3 },
                ].map((leader) => (
                  <div key={leader.rank} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      leader.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                      leader.rank === 2 ? 'bg-gray-300 text-gray-700' :
                      'bg-orange-400 text-orange-900'
                    }`}>
                      {leader.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{leader.name}</p>
                      <p className="text-xs text-gray-600">{leader.referrals} indicações</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/ranking-indicadores"
                className="mt-4 w-full btn-outline text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <span className="hidden sm:inline">Ver Ranking Completo</span>
                <span className="sm:hidden">Ver Ranking</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Use Credits */}
            {credits > 0 && (
              <div className="card p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <h3 className="text-base sm:text-lg font-bold text-green-900">Usar Créditos</h3>
                </div>
                <p className="text-xs sm:text-sm text-green-800 mb-4">
                  Você tem <strong>R$ {credits.toFixed(2)}</strong> disponíveis!
                </p>
                <Link to="/produtos" className="btn-primary w-full py-3">
                  Usar Agora
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
