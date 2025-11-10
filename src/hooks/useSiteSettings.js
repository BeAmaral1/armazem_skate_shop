import { useState, useEffect } from 'react';
import { cmsService } from '../services/api';

/**
 * Hook para buscar configurações do site
 * @param {string|null} group - Grupo de configurações (ex: 'general', 'social', 'seo')
 * @returns {Object} { settings, loading, error, refetch }
 */
export const useSiteSettings = (group = null) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cmsService.getSettings(group);
      setSettings(response.settings || {});
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
      setError(err.message);
      setSettings({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [group]);

  return { 
    settings, 
    loading, 
    error,
    refetch: fetchSettings 
  };
};

/**
 * Hook para buscar uma configuração específica
 * @param {string} group - Grupo da configuração
 * @param {string} key - Chave da configuração
 * @param {any} defaultValue - Valor padrão
 * @returns {Object} { value, loading, error }
 */
export const useSetting = (group, key, defaultValue = '') => {
  const { settings, loading, error } = useSiteSettings(group);

  const value = settings[group]?.[key] || defaultValue;

  return { value, loading, error };
};

/**
 * Hook para acessar configurações gerais do site
 * Retorna configurações comuns como nome, email, telefone, etc
 */
export const useGeneralSettings = () => {
  const { settings, loading, error } = useSiteSettings('general');

  return {
    siteName: settings.general?.site_name || 'Armazém Skate Shop',
    siteEmail: settings.general?.site_email || '',
    sitePhone: settings.general?.site_phone || '',
    siteAddress: settings.general?.site_address || '',
    siteLogo: settings.general?.site_logo || '',
    loading,
    error
  };
};

/**
 * Hook para acessar redes sociais
 */
export const useSocialSettings = () => {
  const { settings, loading, error } = useSiteSettings('social');

  return {
    facebook: settings.social?.facebook_url || '',
    instagram: settings.social?.instagram_url || '',
    twitter: settings.social?.twitter_url || '',
    youtube: settings.social?.youtube_url || '',
    tiktok: settings.social?.tiktok_url || '',
    loading,
    error
  };
};

export default useSiteSettings;
