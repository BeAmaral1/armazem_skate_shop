import React, { useState, useEffect } from 'react';
import { X, Gift, Tag } from 'lucide-react';
import { useReferral } from '../context/ReferralContext';
import { useAuth } from '../context/AuthContext';

const ReferralBanner = () => {
  const { user } = useAuth();
  const { applyReferralCode } = useReferral();
  const [show, setShow] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Verificar se há código de indicação na URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');

    if (refCode && !user) {
      // Novo usuário com código de indicação
      setReferralCode(refCode);
      setShow(true);
      
      // Salvar código temporariamente
      sessionStorage.setItem('pending_referral_code', refCode);
    } else if (!user) {
      // Verificar se há código pendente
      const pendingCode = sessionStorage.getItem('pending_referral_code');
      if (pendingCode) {
        setReferralCode(pendingCode);
        setShow(true);
      }
    }
  }, [user]);

  // Aplicar código automaticamente após registro
  useEffect(() => {
    if (user) {
      const pendingCode = sessionStorage.getItem('pending_referral_code');
      if (pendingCode && !localStorage.getItem('referral_applied_' + user.id)) {
        const result = applyReferralCode(pendingCode);
        if (result.success) {
          setMessage({
            type: 'success',
            text: 'Cupom de 10% aplicado! Use o código ' + result.coupon.code,
          });
          localStorage.setItem('referral_applied_' + user.id, 'true');
          sessionStorage.removeItem('pending_referral_code');
          
          // Mostrar banner por 8 segundos
          setTimeout(() => setShow(false), 8000);
        }
      }
    }
  }, [user, applyReferralCode]);

  const handleClose = () => {
    setShow(false);
    sessionStorage.removeItem('pending_referral_code');
  };

  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 left-4 md:left-auto md:w-96 max-w-md z-40 animate-fadeIn">
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl p-5 sm:p-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg">Presente de Boas-vindas!</h3>
              <p className="text-xs sm:text-sm text-green-100">Código de indicação aplicado</p>
            </div>
          </div>

          {message ? (
            <div className="bg-white/20 rounded-lg p-3 sm:p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
                <p className="font-bold text-sm sm:text-base">Cupom Gerado!</p>
              </div>
              <p className="text-xs sm:text-sm break-words">{message.text}</p>
            </div>
          ) : (
            <div className="bg-white/20 rounded-lg p-3 sm:p-4 mb-4">
              <p className="text-xs sm:text-sm mb-1">Código de indicação:</p>
              <p className="font-bold text-lg sm:text-xl tracking-wider break-all text-center sm:text-left">{referralCode}</p>
            </div>
          )}

          {!user && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-green-100 mb-3">
                Crie sua conta para ganhar <strong>10% de desconto</strong> na primeira compra!
              </p>
              <a
                href="/login"
                className="block w-full py-2.5 sm:py-3 bg-white text-green-600 font-bold rounded-lg text-center text-sm sm:text-base hover:bg-green-50 transition-colors"
              >
                Criar Conta Agora
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralBanner;
