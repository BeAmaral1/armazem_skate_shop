import { useState, useCallback } from 'react';
import { cmsService } from '../services/api';

/**
 * Hook para validar e usar cupons de desconto
 * @returns {Object} { validateCoupon, appliedCoupon, discount, loading, error, clearCoupon }
 */
export const useCoupons = () => {
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Validar e aplicar um cupom
   * @param {string} code - Código do cupom
   * @param {number} cartValue - Valor do carrinho
   */
  const validateCoupon = useCallback(async (code, cartValue) => {
    if (!code || !cartValue) {
      setError('Código ou valor do carrinho inválido');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await cmsService.validateCoupon(code, cartValue);

      if (response.success) {
        setAppliedCoupon(response.coupon);
        setDiscount(response.discount);
        return true;
      } else {
        setError(response.error || 'Cupom inválido');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao validar cupom';
      setError(errorMessage);
      setAppliedCoupon(null);
      setDiscount(0);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpar cupom aplicado
   */
  const clearCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setDiscount(0);
    setError(null);
  }, []);

  /**
   * Calcular valor final com desconto
   * @param {number} cartValue - Valor original do carrinho
   */
  const getFinalValue = useCallback((cartValue) => {
    return cartValue - discount;
  }, [discount]);

  return {
    appliedCoupon,
    discount,
    loading,
    error,
    validateCoupon,
    clearCoupon,
    getFinalValue,
    hasCoupon: !!appliedCoupon
  };
};

/**
 * Hook para gerenciar cupons no contexto do carrinho
 * Salva o cupom no localStorage para persistir entre páginas
 */
export const useCouponInCart = () => {
  const [coupon, setCoupon] = useState(() => {
    const saved = localStorage.getItem('applied_coupon');
    return saved ? JSON.parse(saved) : null;
  });

  const [discount, setDiscount] = useState(() => {
    const saved = localStorage.getItem('coupon_discount');
    return saved ? parseFloat(saved) : 0;
  });

  const applyCoupon = useCallback(async (code, cartValue) => {
    try {
      const response = await cmsService.validateCoupon(code, cartValue);

      if (response.success) {
        const couponData = response.coupon;
        const discountValue = response.discount;

        // Salvar no localStorage
        localStorage.setItem('applied_coupon', JSON.stringify(couponData));
        localStorage.setItem('coupon_discount', discountValue.toString());

        setCoupon(couponData);
        setDiscount(discountValue);

        return { success: true, discount: discountValue };
      }

      return { success: false, error: response.error };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Erro ao validar cupom' 
      };
    }
  }, []);

  const removeCoupon = useCallback(() => {
    localStorage.removeItem('applied_coupon');
    localStorage.removeItem('coupon_discount');
    setCoupon(null);
    setDiscount(0);
  }, []);

  const recalculateDiscount = useCallback(async (newCartValue) => {
    if (!coupon) return;

    try {
      const response = await cmsService.validateCoupon(coupon.code, newCartValue);
      if (response.success) {
        const newDiscount = response.discount;
        localStorage.setItem('coupon_discount', newDiscount.toString());
        setDiscount(newDiscount);
      } else {
        // Cupom não é mais válido, remover
        removeCoupon();
      }
    } catch (err) {
      console.error('Erro ao recalcular desconto:', err);
      removeCoupon();
    }
  }, [coupon, removeCoupon]);

  return {
    coupon,
    discount,
    applyCoupon,
    removeCoupon,
    recalculateDiscount,
    hasCoupon: !!coupon
  };
};

export default useCoupons;
