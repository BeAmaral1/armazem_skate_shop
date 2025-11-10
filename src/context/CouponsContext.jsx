import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CouponsContext = createContext();

export const useCoupons = () => {
  const context = useContext(CouponsContext);
  if (!context) {
    throw new Error('useCoupons must be used within CouponsProvider');
  }
  return context;
};

// Dados mockados de cupons
const MOCK_COUPONS = [
  {
    id: 1,
    code: 'PRIMEIRACOMPRA',
    type: 'percentage', // percentage ou fixed
    value: 15, // 15% ou R$ 15
    description: 'Primeira Compra',
    details: '15% de desconto na sua primeira compra',
    minAmount: 100, // valor mínimo R$ 100
    maxDiscount: 50, // desconto máximo R$ 50
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: 1, // uso único por usuário
    active: true,
    category: 'welcome',
  },
  {
    id: 2,
    code: 'NATAL2024',
    type: 'percentage',
    value: 20,
    description: 'Natal 2024',
    details: '20% de desconto em toda a loja',
    minAmount: 200,
    maxDiscount: 100,
    validFrom: '2024-12-01',
    validUntil: '2024-12-31',
    usageLimit: null, // uso ilimitado
    active: true,
    category: 'seasonal',
  },
  {
    id: 3,
    code: 'FRETEGRATIS',
    type: 'shipping',
    value: 0,
    description: 'Frete Grátis',
    details: 'Frete grátis para qualquer valor',
    minAmount: 0,
    maxDiscount: null,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: null,
    active: true,
    category: 'shipping',
  },
  {
    id: 4,
    code: 'DESCONTO50',
    type: 'fixed',
    value: 50,
    description: 'R$ 50 OFF',
    details: 'R$ 50 de desconto em compras acima de R$ 300',
    minAmount: 300,
    maxDiscount: null,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: null,
    active: true,
    category: 'general',
  },
  {
    id: 5,
    code: 'VIP10',
    type: 'percentage',
    value: 10,
    description: 'Cliente VIP',
    details: '10% de desconto exclusivo para clientes VIP',
    minAmount: 0,
    maxDiscount: null,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: null,
    active: true,
    category: 'vip',
  },
  {
    id: 6,
    code: 'EXPIRADO',
    type: 'percentage',
    value: 25,
    description: 'Cupom Expirado',
    details: 'Este cupom já expirou',
    minAmount: 100,
    maxDiscount: null,
    validFrom: '2024-01-01',
    validUntil: '2024-10-31',
    usageLimit: null,
    active: false,
    category: 'expired',
  },
];

export const CouponsProvider = ({ children }) => {
  const { user } = useAuth();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [usedCoupons, setUsedCoupons] = useState([]); // Cupons já usados pelo usuário

  // Carregar cupons usados do localStorage
  useEffect(() => {
    if (user) {
      const savedUsedCoupons = localStorage.getItem(`usedCoupons_${user.id}`);
      if (savedUsedCoupons) {
        setUsedCoupons(JSON.parse(savedUsedCoupons));
      }
    } else {
      setUsedCoupons([]);
    }
  }, [user]);

  // Salvar cupons usados
  const saveUsedCoupons = (coupons) => {
    if (user) {
      localStorage.setItem(`usedCoupons_${user.id}`, JSON.stringify(coupons));
      setUsedCoupons(coupons);
    }
  };

  // Buscar todos os cupons ativos
  const getActiveCoupons = () => {
    const now = new Date();
    return MOCK_COUPONS.filter((coupon) => {
      const validFrom = new Date(coupon.validFrom);
      const validUntil = new Date(coupon.validUntil);
      return coupon.active && now >= validFrom && now <= validUntil;
    });
  };

  // Buscar cupons disponíveis para o usuário
  const getAvailableCoupons = () => {
    const activeCoupons = getActiveCoupons();
    
    return activeCoupons.filter((coupon) => {
      // Se tem limite de uso e já foi usado, não está disponível
      if (coupon.usageLimit === 1 && usedCoupons.includes(coupon.code)) {
        return false;
      }
      return true;
    });
  };

  // Validar cupom
  const validateCoupon = (code, cartTotal) => {
    if (!code) {
      return { valid: false, error: 'Digite um código de cupom' };
    }

    const coupon = MOCK_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
      return { valid: false, error: 'Cupom não encontrado' };
    }

    if (!coupon.active) {
      return { valid: false, error: 'Cupom inativo' };
    }

    // Verificar data de validade
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom) {
      return { valid: false, error: 'Cupom ainda não está válido' };
    }

    if (now > validUntil) {
      return { valid: false, error: 'Cupom expirado' };
    }

    // Verificar valor mínimo
    if (cartTotal < coupon.minAmount) {
      return {
        valid: false,
        error: `Valor mínimo de R$ ${coupon.minAmount.toFixed(2).replace('.', ',')} para usar este cupom`,
      };
    }

    // Verificar se já foi usado
    if (coupon.usageLimit === 1 && usedCoupons.includes(coupon.code)) {
      return { valid: false, error: 'Cupom já foi utilizado' };
    }

    return { valid: true, coupon };
  };

  // Aplicar cupom
  const applyCoupon = (code, cartTotal) => {
    const validation = validateCoupon(code, cartTotal);

    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    setAppliedCoupon(validation.coupon);
    return { success: true, coupon: validation.coupon };
  };

  // Remover cupom aplicado
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calcular desconto
  const calculateDiscount = (cartTotal) => {
    if (!appliedCoupon) return 0;

    let discount = 0;

    if (appliedCoupon.type === 'percentage') {
      discount = (cartTotal * appliedCoupon.value) / 100;
      // Aplicar desconto máximo se existir
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else if (appliedCoupon.type === 'fixed') {
      discount = appliedCoupon.value;
      // Não pode ser maior que o total
      if (discount > cartTotal) {
        discount = cartTotal;
      }
    } else if (appliedCoupon.type === 'shipping') {
      // Frete grátis - gerenciado separadamente
      discount = 0;
    }

    return discount;
  };

  // Marcar cupom como usado
  const markCouponAsUsed = (code) => {
    if (!usedCoupons.includes(code)) {
      const newUsedCoupons = [...usedCoupons, code];
      saveUsedCoupons(newUsedCoupons);
    }
  };

  // Verificar se é frete grátis
  const isFreeShipping = () => {
    return appliedCoupon && appliedCoupon.type === 'shipping';
  };

  // Copiar código do cupom
  const copyCouponCode = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      return true;
    }
    return false;
  };

  const value = {
    appliedCoupon,
    getActiveCoupons,
    getAvailableCoupons,
    validateCoupon,
    applyCoupon,
    removeCoupon,
    calculateDiscount,
    markCouponAsUsed,
    isFreeShipping,
    copyCouponCode,
    usedCoupons,
  };

  return <CouponsContext.Provider value={value}>{children}</CouponsContext.Provider>;
};
