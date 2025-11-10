import {
  validateCPF,
  validateEmail,
  validatePhone,
  validateAddress,
  validateCardData,
  validateQuantity,
  validateAmount,
  sanitizeString
} from '../utils/validators.js';
import logger from '../utils/logger.js';

/**
 * Middleware para validar dados do checkout
 */
export const validateCheckoutData = (req, res, next) => {
  try {
    const { user, items, shippingAddress, total } = req.body;

    const errors = [];

    // ==================== VALIDAR USUÁRIO ====================
    if (!user) {
      errors.push({ field: 'user', message: 'Dados do usuário são obrigatórios' });
    } else {
      // Nome
      if (!user.name || user.name.trim().length < 3) {
        errors.push({ field: 'user.name', message: 'Nome deve ter pelo menos 3 caracteres' });
      }

      // Email
      if (!validateEmail(user.email)) {
        errors.push({ field: 'user.email', message: 'Email inválido' });
      }

      // CPF (opcional mas se fornecido deve ser válido)
      if (user.cpf && !validateCPF(user.cpf)) {
        errors.push({ field: 'user.cpf', message: 'CPF inválido' });
      }

      // Telefone
      if (!validatePhone(user.phone)) {
        errors.push({ field: 'user.phone', message: 'Telefone inválido' });
      }

      // Sanitizar strings
      if (user.name) user.name = sanitizeString(user.name);
      if (user.email) user.email = sanitizeString(user.email).toLowerCase();
    }

    // ==================== VALIDAR ITEMS ====================
    if (!items || !Array.isArray(items) || items.length === 0) {
      errors.push({ field: 'items', message: 'Carrinho vazio' });
    } else {
      // Validar cada item
      items.forEach((item, index) => {
        if (!item.productId) {
          errors.push({ field: `items[${index}].productId`, message: 'ID do produto obrigatório' });
        }

        if (!validateQuantity(item.quantity, 50)) {
          errors.push({ field: `items[${index}].quantity`, message: 'Quantidade inválida (1-50)' });
        }

        if (!validateAmount(item.price)) {
          errors.push({ field: `items[${index}].price`, message: 'Preço inválido' });
        }
      });

      // Validar total de items (máximo 100 produtos no carrinho)
      if (items.length > 100) {
        errors.push({ field: 'items', message: 'Máximo de 100 itens no carrinho' });
      }
    }

    // ==================== VALIDAR ENDEREÇO ====================
    if (!shippingAddress) {
      errors.push({ field: 'shippingAddress', message: 'Endereço de entrega obrigatório' });
    } else {
      const addressValidation = validateAddress(shippingAddress);
      if (!addressValidation.valid) {
        errors.push({
          field: `shippingAddress.${addressValidation.field}`,
          message: addressValidation.message || 'Campo obrigatório'
        });
      }

      // Sanitizar strings do endereço
      Object.keys(shippingAddress).forEach(key => {
        if (typeof shippingAddress[key] === 'string') {
          shippingAddress[key] = sanitizeString(shippingAddress[key]);
        }
      });
    }

    // ==================== VALIDAR TOTAL ====================
    if (!validateAmount(total)) {
      errors.push({ field: 'total', message: 'Valor total inválido' });
    }

    // Se houver erros, retornar
    if (errors.length > 0) {
      logger.warn('Checkout validation failed', {
        errors,
        ip: req.ip
      });

      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors
      });
    }

    // Dados válidos, continuar
    logger.info('Checkout data validated successfully', {
      userEmail: user.email,
      itemsCount: items.length,
      total
    });

    next();

  } catch (error) {
    logger.error('Error in checkout validation middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro na validação dos dados'
    });
  }
};

/**
 * Middleware para validar dados do cartão
 */
export const validatePaymentCard = (req, res, next) => {
  try {
    const { cardData, paymentMethod } = req.body;

    // Só validar se for cartão de crédito
    if (paymentMethod !== 'CREDIT_CARD') {
      return next();
    }

    if (!cardData) {
      return res.status(400).json({
        success: false,
        message: 'Dados do cartão são obrigatórios'
      });
    }

    const validation = validateCardData(cardData);

    if (!validation.valid) {
      logger.warn('Card validation failed', {
        field: validation.field,
        ip: req.ip
      });

      return res.status(400).json({
        success: false,
        message: validation.message,
        field: validation.field
      });
    }

    next();

  } catch (error) {
    logger.error('Error in card validation middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro na validação do cartão'
    });
  }
};

/**
 * Middleware para detectar possível fraude
 */
export const checkFraud = async (req, res, next) => {
  try {
    const { user, items, total } = req.body;

    // Simular verificação se é primeiro pedido
    // (Em produção, verificar no banco)
    const isFirstOrder = true;

    const fraudCheck = {
      email: user.email,
      cpf: user.cpf,
      name: user.name,
      total: total,
      itemsCount: items.length,
      isFirstOrder
    };

    const fraudAnalysis = detectFraud(fraudCheck);

    if (fraudAnalysis.isSuspicious) {
      logger.warn('Suspicious order detected', {
        riskLevel: fraudAnalysis.riskLevel,
        indicators: fraudAnalysis.indicators,
        userEmail: user.email,
        total
      });

      // Se risco MUITO alto, bloquear
      if (fraudAnalysis.riskLevel === 'high') {
        return res.status(403).json({
          success: false,
          message: 'Pedido bloqueado por suspeita de fraude. Entre em contato com o suporte.'
        });
      }

      // Se risco médio, apenas logar e adicionar flag
      req.fraudAnalysis = fraudAnalysis;
    }

    next();

  } catch (error) {
    logger.error('Error in fraud check middleware:', error);
    // Não bloquear por erro no anti-fraude, apenas logar
    next();
  }
};

function detectFraud(data) {
  const indicators = [];

  if (data.isFirstOrder && data.total > 5000) {
    indicators.push('high_value_first_order');
  }

  if (data.itemsCount > 20) {
    indicators.push('too_many_items');
  }

  const suspiciousEmailPatterns = [
    /^[a-z]{1,2}[0-9]+@/,
    /temp/i,
    /fake/i,
    /test/i
  ];

  if (suspiciousEmailPatterns.some(pattern => pattern.test(data.email))) {
    indicators.push('suspicious_email');
  }

  return {
    isSuspicious: indicators.length > 0,
    indicators,
    riskLevel: indicators.length === 0 ? 'low' :
                indicators.length === 1 ? 'medium' : 'high'
  };
}
