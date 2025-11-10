import logger from '../utils/logger.js';

// Rate Limiter simples (em produção, use Redis)
const requestCounts = new Map();
const blockedIPs = new Map();

/**
 * Rate Limiter - Previne abuso de APIs
 */
export const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos
    maxRequests = 100, // 100 requisições por janela
    message = 'Muitas requisições. Tente novamente mais tarde.',
    skipSuccessfulRequests = false
  } = options;

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    // Verificar se IP está bloqueado temporariamente
    if (blockedIPs.has(ip)) {
      const blockInfo = blockedIPs.get(ip);
      if (now < blockInfo.until) {
        logger.warn('Blocked IP attempted access', { ip, until: blockInfo.until });
        return res.status(429).json({
          success: false,
          message: 'IP temporariamente bloqueado. Tente novamente mais tarde.',
          retryAfter: Math.ceil((blockInfo.until - now) / 1000)
        });
      } else {
        blockedIPs.delete(ip);
      }
    }

    // Obter contador de requisições
    let requestInfo = requestCounts.get(ip);
    
    if (!requestInfo || now - requestInfo.resetTime > windowMs) {
      // Nova janela
      requestInfo = {
        count: 0,
        resetTime: now + windowMs
      };
    }

    requestInfo.count++;
    requestCounts.set(ip, requestInfo);

    // Verificar se excedeu o limite
    if (requestInfo.count > maxRequests) {
      // Bloquear IP por 1 hora
      blockedIPs.set(ip, {
        until: now + (60 * 60 * 1000)
      });

      logger.warn('Rate limit exceeded', {
        ip,
        count: requestInfo.count,
        maxRequests
      });

      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((requestInfo.resetTime - now) / 1000)
      });
    }

    // Headers informativos
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - requestInfo.count));
    res.setHeader('X-RateLimit-Reset', new Date(requestInfo.resetTime).toISOString());

    next();
  };
};

/**
 * Rate Limiter específico para checkout (mais restritivo)
 */
export const checkoutRateLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 minutos
  maxRequests: 10, // Apenas 10 tentativas de checkout por 10 min
  message: 'Muitas tentativas de finalização de compra. Aguarde alguns minutos.'
});

/**
 * Rate Limiter para criação de pedidos (muito restritivo)
 */
export const orderCreationLimiter = rateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutos
  maxRequests: 3, // Apenas 3 pedidos por 5 min
  message: 'Limite de criação de pedidos atingido. Aguarde alguns minutos.'
});

// Limpar memória a cada hora
setInterval(() => {
  const now = Date.now();
  
  // Limpar rate limits expirados
  for (const [ip, info] of requestCounts.entries()) {
    if (now > info.resetTime) {
      requestCounts.delete(ip);
    }
  }

  // Limpar bloqueios expirados
  for (const [ip, info] of blockedIPs.entries()) {
    if (now > info.until) {
      blockedIPs.delete(ip);
    }
  }
}, 60 * 60 * 1000); // A cada hora
