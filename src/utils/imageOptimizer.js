/**
 * Otimiza URLs de imagens para melhor performance
 * Adiciona parâmetros de compressão e dimensionamento
 */

/**
 * Otimiza URL do Unsplash com parâmetros de qualidade e tamanho
 * @param {string} url - URL original da imagem
 * @param {object} options - Opções de otimização
 * @returns {string} URL otimizada
 */
export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return '';

  const {
    width = 800,
    quality = 80,
    format = 'auto',
    fit = 'crop',
    dpr = 1
  } = options;

  // Se não for Unsplash, retorna a URL original
  if (!url.includes('unsplash.com')) {
    return url;
  }

  // Remove parâmetros existentes
  const baseUrl = url.split('?')[0];

  // Adiciona parâmetros otimizados
  const params = new URLSearchParams({
    w: width,
    q: quality,
    auto: format,
    fit: fit,
    dpr: dpr
  });

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Otimiza URL para thumbnail (pequeno)
 * @param {string} url - URL original
 * @returns {string} URL otimizada para thumbnail
 */
export const optimizeThumbnail = (url) => {
  return optimizeImageUrl(url, {
    width: 400,
    quality: 75,
    format: 'auto'
  });
};

/**
 * Otimiza URL para card de produto
 * @param {string} url - URL original
 * @returns {string} URL otimizada para card
 */
export const optimizeProductCard = (url) => {
  return optimizeImageUrl(url, {
    width: 600,
    quality: 80,
    format: 'auto'
  });
};

/**
 * Otimiza URL para hero/banner
 * @param {string} url - URL original
 * @returns {string} URL otimizada para hero
 */
export const optimizeHeroImage = (url) => {
  return optimizeImageUrl(url, {
    width: 1920,
    quality: 85,
    format: 'auto',
    fit: 'crop'
  });
};

/**
 * Otimiza URL para galeria de produto (alta qualidade)
 * @param {string} url - URL original
 * @returns {string} URL otimizada para galeria
 */
export const optimizeProductGallery = (url) => {
  return optimizeImageUrl(url, {
    width: 1200,
    quality: 85,
    format: 'auto'
  });
};

/**
 * Gera srcset para imagens responsivas
 * @param {string} url - URL original
 * @param {array} sizes - Array de larguras [400, 800, 1200]
 * @returns {string} String srcset
 */
export const generateSrcSet = (url, sizes = [400, 800, 1200]) => {
  if (!url || !url.includes('unsplash.com')) {
    return '';
  }

  return sizes
    .map(width => `${optimizeImageUrl(url, { width, quality: 80 })} ${width}w`)
    .join(', ');
};

/**
 * Pré-carrega imagem crítica
 * @param {string} url - URL da imagem
 */
export const preloadImage = (url) => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = optimizeImageUrl(url);
  document.head.appendChild(link);
};
