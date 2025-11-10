/**
 * Validadores de dados para segurança
 */

/**
 * Validar CPF
 */
export function validateCPF(cpf) {
  if (!cpf) return false;

  // Remover caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  // Verificar se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validar primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
}

/**
 * Validar CNPJ
 */
export function validateCNPJ(cnpj) {
  if (!cnpj) return false;

  cnpj = cnpj.replace(/\D/g, '');

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;

  return true;
}

/**
 * Validar CEP
 */
export function validateCEP(cep) {
  if (!cep) return false;
  cep = cep.replace(/\D/g, '');
  return /^[0-9]{8}$/.test(cep);
}

/**
 * Validar Email
 */
export function validateEmail(email) {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validar Telefone (Brasil)
 */
export function validatePhone(phone) {
  if (!phone) return false;
  phone = phone.replace(/\D/g, '');
  // Aceita: (11) 99999-9999 ou (11) 9999-9999
  return /^[1-9]{2}9?[0-9]{8}$/.test(phone);
}

/**
 * Validar Cartão de Crédito (Luhn Algorithm)
 */
export function validateCreditCard(cardNumber) {
  if (!cardNumber) return false;
  
  cardNumber = cardNumber.replace(/\D/g, '');
  
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validar CVV
 */
export function validateCVV(cvv) {
  if (!cvv) return false;
  return /^[0-9]{3,4}$/.test(cvv);
}

/**
 * Validar data de expiração do cartão
 */
export function validateCardExpiry(month, year) {
  if (!month || !year) return false;

  month = parseInt(month);
  year = parseInt(year);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Últimos 2 dígitos
  const currentMonth = now.getMonth() + 1;

  // Se ano fornecido tem 4 dígitos, pegar últimos 2
  if (year > 100) {
    year = year % 100;
  }

  // Cartão expirado
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  // Cartão com validade muito no futuro (mais de 10 anos)
  if (year > currentYear + 10) return false;

  return true;
}

/**
 * Sanitizar string (prevenir XSS)
 */
export function sanitizeString(str) {
  if (!str) return '';
  
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validar quantidade de produto
 */
export function validateQuantity(quantity, maxQuantity = 10) {
  quantity = parseInt(quantity);
  return quantity > 0 && quantity <= maxQuantity;
}

/**
 * Validar valor monetário
 */
export function validateAmount(amount) {
  amount = parseFloat(amount);
  return amount > 0 && amount < 1000000; // Máximo 1 milhão
}

/**
 * Validar nome (sem números, caracteres especiais)
 */
export function validateName(name) {
  if (!name || name.length < 3) return false;
  // Aceita letras, espaços e acentos
  return /^[a-zA-ZÀ-ÿ\s]+$/.test(name);
}

/**
 * Validar senha (mínimo 8 caracteres, 1 letra, 1 número)
 */
export function validatePassword(password) {
  if (!password || password.length < 8) return false;
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasLetter && hasNumber;
}

/**
 * Validar objeto de endereço completo
 */
export function validateAddress(address) {
  const required = ['zipCode', 'street', 'number', 'neighborhood', 'city', 'state'];
  
  for (const field of required) {
    if (!address[field] || address[field].trim() === '') {
      return { valid: false, field };
    }
  }

  if (!validateCEP(address.zipCode)) {
    return { valid: false, field: 'zipCode', message: 'CEP inválido' };
  }

  return { valid: true };
}

/**
 * Validar dados do cartão completos
 */
export function validateCardData(cardData) {
  if (!validateCreditCard(cardData.number)) {
    return { valid: false, field: 'number', message: 'Número do cartão inválido' };
  }

  if (!validateCVV(cardData.cvv)) {
    return { valid: false, field: 'cvv', message: 'CVV inválido' };
  }

  if (!validateCardExpiry(cardData.expMonth, cardData.expYear)) {
    return { valid: false, field: 'expiry', message: 'Data de expiração inválida' };
  }

  if (!validateName(cardData.holderName)) {
    return { valid: false, field: 'holderName', message: 'Nome do titular inválido' };
  }

  return { valid: true };
}

/**
 * Detectar possível fraude (regras básicas)
 */
export function detectFraud(orderData) {
  const fraudIndicators = [];

  // Valor muito alto para primeiro pedido
  if (orderData.isFirstOrder && orderData.total > 5000) {
    fraudIndicators.push('high_value_first_order');
  }

  // Muitos produtos diferentes
  if (orderData.itemsCount > 20) {
    fraudIndicators.push('too_many_items');
  }

  // Email suspeito
  const suspiciousEmailPatterns = [
    /^[a-z]{1,2}[0-9]+@/,  // Ex: a1@, b123@
    /temp/i,
    /fake/i,
    /test/i
  ];

  if (suspiciousEmailPatterns.some(pattern => pattern.test(orderData.email))) {
    fraudIndicators.push('suspicious_email');
  }

  // CPF e nome não combinam (verificação básica)
  if (orderData.cpf && orderData.name) {
    const cpfClean = orderData.cpf.replace(/\D/g, '');
    if (cpfClean === '11111111111' || cpfClean === '00000000000') {
      fraudIndicators.push('invalid_cpf');
    }
  }

  return {
    isSuspicious: fraudIndicators.length > 0,
    indicators: fraudIndicators,
    riskLevel: fraudIndicators.length === 0 ? 'low' :
                fraudIndicators.length === 1 ? 'medium' : 'high'
  };
}
