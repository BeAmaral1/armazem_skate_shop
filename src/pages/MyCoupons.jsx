import React, { useState } from 'react';
import { Tag, Copy, Check, Calendar, ShoppingCart, Percent, DollarSign, Truck } from 'lucide-react';
import { useCoupons } from '../context/CouponsContext';
import ProfileSidebar from '../components/ProfileSidebar';
import Toast from '../components/Toast';

const MyCoupons = () => {
  const { getAvailableCoupons, copyCouponCode, usedCoupons } = useCoupons();
  const [copiedCode, setCopiedCode] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all'); // all, percentage, fixed, shipping

  const allCoupons = getAvailableCoupons();

  // Filtrar cupons
  const filteredCoupons = filter === 'all' 
    ? allCoupons 
    : allCoupons.filter(coupon => coupon.type === filter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleCopy = (code) => {
    const success = copyCouponCode(code);
    
    if (success) {
      setCopiedCode(code);
      setToast({
        type: 'success',
        message: {
          title: '✅ Copiado!',
          description: `Código ${code} copiado para a área de transferência`,
        },
      });

      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } else {
      setToast({
        type: 'error',
        message: {
          title: '❌ Erro',
          description: 'Não foi possível copiar o código',
        },
      });
    }
  };

  const getCouponIcon = (type) => {
    switch (type) {
      case 'percentage':
        return Percent;
      case 'fixed':
        return DollarSign;
      case 'shipping':
        return Truck;
      default:
        return Tag;
    }
  };

  const getCouponLabel = (coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}% OFF`;
    } else if (coupon.type === 'fixed') {
      return `R$ ${coupon.value} OFF`;
    } else if (coupon.type === 'shipping') {
      return 'FRETE GRÁTIS';
    }
  };

  const getCouponColor = (type) => {
    switch (type) {
      case 'percentage':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-700',
          border: 'border-purple-300',
          badge: 'bg-purple-500',
        };
      case 'fixed':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-700',
          border: 'border-blue-300',
          badge: 'bg-blue-500',
        };
      case 'shipping':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          border: 'border-green-300',
          badge: 'bg-green-500',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-300',
          badge: 'bg-gray-500',
        };
    }
  };

  const filters = [
    { value: 'all', label: 'Todos', count: allCoupons.length },
    { value: 'percentage', label: 'Porcentagem', count: allCoupons.filter(c => c.type === 'percentage').length },
    { value: 'fixed', label: 'Valor Fixo', count: allCoupons.filter(c => c.type === 'fixed').length },
    { value: 'shipping', label: 'Frete Grátis', count: allCoupons.filter(c => c.type === 'shipping').length },
  ];

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Tag className="w-8 h-8" />
              Meus Cupons
            </h1>
            <p className="text-gray-600">
              Aproveite os cupons de desconto disponíveis para você
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {filters.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFilter(f.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        filter === f.value
                          ? 'border-dark-900 bg-dark-900 text-white'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <p className="text-xs font-medium mb-1">{f.label}</p>
                      <p className={`text-lg font-bold ${
                        filter === f.value ? 'text-white' : 'text-gray-900'
                      }`}>
                        {f.count}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Coupons Grid */}
              {filteredCoupons.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum cupom disponível
                  </h3>
                  <p className="text-gray-600">
                    {filter === 'all'
                      ? 'Não há cupons disponíveis no momento'
                      : `Não há cupons de ${filters.find(f => f.value === filter)?.label.toLowerCase()} disponíveis`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCoupons.map((coupon) => {
                    const Icon = getCouponIcon(coupon.type);
                    const colors = getCouponColor(coupon.type);
                    const isUsed = usedCoupons.includes(coupon.code);

                    return (
                      <div
                        key={coupon.id}
                        className={`bg-white rounded-xl border-2 ${colors.border} overflow-hidden hover:shadow-lg transition-shadow ${
                          isUsed ? 'opacity-60' : ''
                        }`}
                      >
                        {/* Header */}
                        <div className={`${colors.bg} p-4 border-b-2 ${colors.border}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 ${colors.badge} rounded-lg flex items-center justify-center`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${colors.text}`}>
                                  {coupon.description}
                                </p>
                                <p className={`text-2xl font-bold ${colors.text}`}>
                                  {getCouponLabel(coupon)}
                                </p>
                              </div>
                            </div>
                            {isUsed && (
                              <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">
                                USADO
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <p className="text-sm text-gray-700 mb-4">{coupon.details}</p>

                          {/* Info */}
                          <div className="space-y-2 mb-4 text-xs text-gray-600">
                            {coupon.minAmount > 0 && (
                              <div className="flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4" />
                                <span>Valor mínimo: R$ {coupon.minAmount.toFixed(2).replace('.', ',')}</span>
                              </div>
                            )}
                            {coupon.maxDiscount && (
                              <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                <span>Desconto máximo: R$ {coupon.maxDiscount.toFixed(2).replace('.', ',')}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Válido até {formatDate(coupon.validUntil)}</span>
                            </div>
                            {coupon.usageLimit === 1 && (
                              <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                <span>Uso único</span>
                              </div>
                            )}
                          </div>

                          {/* Code + Copy Button */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono font-bold text-gray-900 text-center border-2 border-dashed border-gray-300">
                              {coupon.code}
                            </div>
                            <button
                              onClick={() => handleCopy(coupon.code)}
                              disabled={isUsed}
                              className={`p-3 rounded-lg transition-all ${
                                copiedCode === coupon.code
                                  ? 'bg-green-500 text-white'
                                  : isUsed
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-dark-900 text-white hover:bg-dark-950'
                              }`}
                              title="Copiar código"
                            >
                              {copiedCode === coupon.code ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyCoupons;
