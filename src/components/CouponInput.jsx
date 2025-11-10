import React, { useState } from 'react';
import { Tag, X, Check, AlertCircle, Loader } from 'lucide-react';
import { useCoupons } from '../context/CouponsContext';

const CouponInput = ({ cartTotal, onApply }) => {
  const { appliedCoupon, applyCoupon, removeCoupon, calculateDiscount } = useCoupons();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Digite um código de cupom');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = applyCoupon(code.trim(), cartTotal);

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setCode('');
      setError('');
      if (onApply) {
        onApply(result.coupon);
      }
      // Limpar mensagem de sucesso após 3s
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error);
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setCode('');
    setError('');
    setSuccess(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const formatDiscount = (discount) => {
    return discount.toFixed(2).replace('.', ',');
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

  return (
    <div className="space-y-3">
      {/* Input */}
      {!appliedCoupon ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cupom de Desconto
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className={`input-field pl-10 uppercase ${error ? 'border-red-500' : ''}`}
                placeholder="Digite o código"
              />
            </div>
            <button
              onClick={handleApply}
              disabled={loading || !code.trim()}
              className="btn-primary px-6 whitespace-nowrap"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                'Aplicar'
              )}
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Cupom aplicado com sucesso!</span>
            </div>
          )}
        </div>
      ) : (
        /* Applied Coupon */
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cupom Aplicado
          </label>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{appliedCoupon.code}</p>
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">
                      {getCouponLabel(appliedCoupon)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{appliedCoupon.details}</p>
                  {appliedCoupon.type !== 'shipping' && (
                    <p className="text-lg font-bold text-green-600">
                      Desconto: - R$ {formatDiscount(calculateDiscount(cartTotal))}
                    </p>
                  )}
                  {appliedCoupon.type === 'shipping' && (
                    <p className="text-lg font-bold text-green-600">
                      Frete Grátis Ativado!
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                title="Remover cupom"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
