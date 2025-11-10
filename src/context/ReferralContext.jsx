import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReferralContext = createContext();

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within ReferralProvider');
  }
  return context;
};

export const ReferralProvider = ({ children }) => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [credits, setCredits] = useState(0);
  const [referralCode, setReferralCode] = useState('');

  // Carregar dados do localStorage
  useEffect(() => {
    if (user) {
      const savedReferrals = localStorage.getItem(`referrals_${user.id}`);
      const savedCredits = localStorage.getItem(`credits_${user.id}`);
      const savedCode = localStorage.getItem(`referral_code_${user.id}`);

      if (savedReferrals) {
        try {
          setReferrals(JSON.parse(savedReferrals));
        } catch (error) {
          setReferrals([]);
        }
      }

      if (savedCredits) {
        setCredits(parseFloat(savedCredits));
      }

      if (savedCode) {
        setReferralCode(savedCode);
      } else {
        // Gerar código único para o usuário
        const code = generateReferralCode(user);
        setReferralCode(code);
        localStorage.setItem(`referral_code_${user.id}`, code);
      }
    }
  }, [user]);

  // Salvar no localStorage quando mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem(`referrals_${user.id}`, JSON.stringify(referrals));
      localStorage.setItem(`credits_${user.id}`, credits.toString());
    }
  }, [referrals, credits, user]);

  // Gerar código de indicação único
  const generateReferralCode = (user) => {
    const firstName = user.name.split(' ')[0].toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${firstName}${random}`;
  };

  // Registrar nova indicação
  const addReferral = (referredEmail, referredName) => {
    if (!user) return;

    const newReferral = {
      id: Date.now(),
      referredEmail,
      referredName,
      date: new Date().toISOString(),
      status: 'pending', // pending | completed | credited
      creditEarned: 0,
      firstPurchaseDate: null,
    };

    setReferrals(prev => [newReferral, ...prev]);
  };

  // Completar indicação (quando indicado faz primeira compra)
  const completeReferral = (referralId, purchaseAmount) => {
    setReferrals(prev =>
      prev.map(ref => {
        if (ref.id === referralId && ref.status === 'pending') {
          return {
            ...ref,
            status: 'completed',
            firstPurchaseDate: new Date().toISOString(),
          };
        }
        return ref;
      })
    );
  };

  // Creditar valor da indicação
  const creditReferral = (referralId, creditAmount = 20) => {
    setReferrals(prev =>
      prev.map(ref => {
        if (ref.id === referralId && ref.status === 'completed') {
          return {
            ...ref,
            status: 'credited',
            creditEarned: creditAmount,
          };
        }
        return ref;
      })
    );

    // Adicionar crédito ao usuário
    setCredits(prev => prev + creditAmount);
  };

  // Usar crédito no checkout
  const useCredits = (amount) => {
    if (amount > credits) {
      return false;
    }
    setCredits(prev => prev - amount);
    return true;
  };

  // Validar código de indicação
  const validateReferralCode = (code) => {
    // Em produção, validar no backend
    // Por agora, validar formato
    return code && code.length >= 5 && /^[A-Z0-9]+$/.test(code);
  };

  // Aplicar código de indicação (para novo usuário)
  const applyReferralCode = (code) => {
    if (!validateReferralCode(code)) {
      return {
        success: false,
        message: 'Código de indicação inválido',
      };
    }

    // Salvar código aplicado
    localStorage.setItem('applied_referral_code', code);
    
    // Gerar cupom de 10% para o novo usuário
    const coupon = {
      code: `INDICACAO${code}`,
      discount: 10,
      type: 'percentage',
      minValue: 0,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      description: 'Cupom de indicação - 10% de desconto',
      usedBy: [],
    };

    // Salvar cupom no sistema de cupons
    const savedCoupons = localStorage.getItem('available_coupons') || '[]';
    const coupons = JSON.parse(savedCoupons);
    coupons.push(coupon);
    localStorage.setItem('available_coupons', JSON.stringify(coupons));

    return {
      success: true,
      message: 'Código aplicado com sucesso! Cupom de 10% gerado.',
      coupon,
    };
  };

  // Estatísticas
  const stats = {
    totalReferrals: referrals.length,
    pendingReferrals: referrals.filter(r => r.status === 'pending').length,
    completedReferrals: referrals.filter(r => r.status === 'completed').length,
    creditedReferrals: referrals.filter(r => r.status === 'credited').length,
    totalCreditsEarned: referrals.reduce((sum, r) => sum + (r.creditEarned || 0), 0),
    availableCredits: credits,
  };

  // Gerar link de indicação
  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${referralCode}`;
  };

  // Mensagens de compartilhamento
  const getShareMessages = () => {
    return {
      whatsapp: `Olá! 🎁 Ganhe 10% de desconto na Armazém Skate Shop usando meu código de indicação: ${referralCode}\n\nAcesse: ${getReferralLink()}`,
      email: {
        subject: 'Ganhe 10% de desconto na Armazém Skate Shop!',
        body: `Olá!\n\nEu uso a Armazém Skate Shop e recomendo muito!\n\nUse meu código de indicação ${referralCode} e ganhe 10% de desconto na sua primeira compra.\n\nAcesse: ${getReferralLink()}\n\nAproveite!`,
      },
      copy: `Use o código ${referralCode} e ganhe 10% de desconto! ${getReferralLink()}`,
    };
  };

  const value = {
    referrals,
    credits,
    referralCode,
    stats,
    addReferral,
    completeReferral,
    creditReferral,
    useCredits,
    validateReferralCode,
    applyReferralCode,
    getReferralLink,
    getShareMessages,
  };

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  );
};

export default ReferralContext;
