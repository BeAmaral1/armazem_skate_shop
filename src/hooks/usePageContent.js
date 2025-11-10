import { useState, useEffect } from 'react';
import { cmsService } from '../services/api';

/**
 * Hook para buscar conteúdo de uma página específica
 * @param {string} page - Nome da página (ex: 'home', 'about', 'footer')
 * @param {string} language - Idioma do conteúdo (padrão: 'pt-BR')
 * @returns {Object} { content, loading, error, refetch }
 */
export const usePageContent = (page, language = 'pt-BR') => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cmsService.getPageContent(page, language);
      setContent(response.content || {});
    } catch (err) {
      console.error('Erro ao buscar conteúdo da página:', err);
      setError(err.message);
      // Retornar objeto vazio em caso de erro para não quebrar o site
      setContent({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page) {
      fetchContent();
    }
  }, [page, language]);

  return { 
    content, 
    loading, 
    error,
    refetch: fetchContent 
  };
};

/**
 * Hook para buscar um valor específico de conteúdo
 * @param {string} page - Nome da página
 * @param {string} section - Seção da página
 * @param {string} key - Chave do conteúdo
 * @param {string} defaultValue - Valor padrão se não encontrar
 * @returns {Object} { value, type, loading, error }
 */
export const useContentValue = (page, section, key, defaultValue = '') => {
  const { content, loading, error } = usePageContent(page);

  const value = content[section]?.[key]?.value || defaultValue;
  const type = content[section]?.[key]?.type || 'TEXT';

  return { value, type, loading, error };
};

export default usePageContent;
