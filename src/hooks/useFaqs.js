import { useState, useEffect } from 'react';
import { cmsService } from '../services/api';

/**
 * Hook para buscar FAQs
 * @param {string|null} category - Categoria das FAQs (ex: 'envio', 'pagamento', 'produto')
 * @returns {Object} { faqs, loading, error, refetch }
 */
export const useFaqs = (category = null) => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cmsService.getFaqs(category);
      setFaqs(response.faqs || []);
    } catch (err) {
      console.error('Erro ao buscar FAQs:', err);
      setError(err.message);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [category]);

  return { 
    faqs, 
    loading, 
    error,
    refetch: fetchFaqs 
  };
};

/**
 * Hook para organizar FAQs por categoria
 * Útil para exibir FAQs agrupadas
 */
export const useFaqsByCategory = () => {
  const { faqs, loading, error, refetch } = useFaqs();

  const faqsByCategory = faqs.reduce((acc, faq) => {
    const category = faq.category || 'geral';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(faq);
    return acc;
  }, {});

  return {
    faqsByCategory,
    faqs,
    loading,
    error,
    refetch
  };
};

/**
 * Hook para buscar FAQs de uma categoria específica
 * Atalhos para categorias comuns
 */
export const useShippingFaqs = () => useFaqs('envio');
export const usePaymentFaqs = () => useFaqs('pagamento');
export const useProductFaqs = () => useFaqs('produto');
export const useReturnFaqs = () => useFaqs('troca');
export const useGeneralFaqs = () => useFaqs('geral');

export default useFaqs;
