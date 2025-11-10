import { useState, useEffect } from 'react';
import { cmsService } from '../services/api';

/**
 * Hook para buscar banners ativos
 * @param {string|null} position - Posição do banner (ex: 'home_hero', 'category_top')
 * @returns {Object} { banners, loading, error, refetch }
 */
export const useBanners = (position = null) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cmsService.getBanners(position);
      setBanners(response.banners || []);
    } catch (err) {
      console.error('Erro ao buscar banners:', err);
      setError(err.message);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [position]);

  return { 
    banners, 
    loading, 
    error,
    refetch: fetchBanners 
  };
};

/**
 * Hook para buscar banners do hero da home
 * Atalho para useBanners('home_hero')
 */
export const useHomeBanners = () => {
  return useBanners('home_hero');
};

/**
 * Hook para buscar um banner único
 * Útil quando você precisa de apenas 1 banner em uma posição
 */
export const useSingleBanner = (position) => {
  const { banners, loading, error, refetch } = useBanners(position);

  return {
    banner: banners[0] || null,
    loading,
    error,
    refetch
  };
};

export default useBanners;
