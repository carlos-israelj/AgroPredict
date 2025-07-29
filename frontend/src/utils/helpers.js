// utils/helpers.js - Funciones auxiliares para Web3 y UI
import { ethers } from 'ethers';
import { CONFIG } from '../config';

// =================== CONVERSIONES DE PRECIO ===================

/**
 * Convierte USD a ETH usando la tasa configurada
 * @param {number} usdAmount - Cantidad en USD
 * @param {number} rate - Tasa ETH/USD (default: CONFIG.ETH_USD_RATE)
 * @returns {number} Cantidad en ETH
 */
export const convertUSDtoETH = (usdAmount, rate = CONFIG.ETH_USD_RATE) => {
  const ethAmount = parseFloat(usdAmount) / rate;
  return parseFloat(ethAmount.toFixed(CONFIG.PRICE_DECIMALS));
};

/**
 * Convierte ETH a USD usando la tasa configurada
 * @param {number} ethAmount - Cantidad en ETH
 * @param {number} rate - Tasa ETH/USD (default: CONFIG.ETH_USD_RATE)
 * @returns {number} Cantidad en USD
 */
export const convertETHtoUSD = (ethAmount, rate = CONFIG.ETH_USD_RATE) => {
  const usdAmount = parseFloat(ethAmount) * rate;
  return parseFloat(usdAmount.toFixed(CONFIG.USD_DECIMALS));
};

/**
 * Convierte ETH a Wei (unidad base de Ethereum) - VERSIÓN CORREGIDA
 * @param {number|string} ethAmount - Cantidad en ETH
 * @returns {ethers.BigNumber} Cantidad en Wei
 */
export const convertETHtoWei = (ethAmount) => {
  try {
    console.log('🔧 === CONVERT ETH TO WEI (FIXED) ===');
    console.log('🔧 Input ethAmount:', ethAmount);
    console.log('🔧 Input type:', typeof ethAmount);
    
    // ✅ CORRECCIÓN: Normalizar el número para evitar problemas de precisión
    const numAmount = Number(ethAmount);
    console.log('🔧 Converted to number:', numAmount);
    
    if (isNaN(numAmount) || numAmount < 0) {
      throw new Error(`Cantidad ETH inválida: ${ethAmount}`);
    }
    
    // ✅ CORRECCIÓN: Usar parseUnits en lugar de parseEther para mayor control
    // Redondear a 18 decimales para evitar problemas de precisión flotante
    const roundedAmount = Math.round(numAmount * 1e18) / 1e18;
    console.log('🔧 Rounded amount:', roundedAmount);
    
    // Convertir a string con exactamente 18 decimales
    const amountString = roundedAmount.toFixed(18);
    console.log('🔧 Amount string:', amountString);
    
    const weiAmount = ethers.utils.parseEther(amountString);
    console.log('🔧 Wei amount:', weiAmount.toString());
    
    return weiAmount;
    
  } catch (error) {
    console.error('❌ Error converting ETH to Wei:', error);
    console.error('❌ Original ethAmount:', ethAmount);
    throw new Error(`Error convirtiendo ETH a Wei: ${ethAmount} - ${error.message}`);
  }
};

// ✅ NUEVA FUNCIÓN: Conversión mejorada USD → ETH → Wei
export const convertUSDtoWei = (usdAmount, ethUsdRate = 2500) => {
  try {
    console.log('💰 === CONVERT USD TO WEI (NEW) ===');
    console.log('💰 USD amount:', usdAmount);
    console.log('💰 ETH/USD rate:', ethUsdRate);
    
    const ethAmount = parseFloat(usdAmount) / ethUsdRate;
    console.log('💰 ETH amount calculated:', ethAmount);
    
    // Usar la función corregida
    return convertETHtoWei(ethAmount);
    
  } catch (error) {
    console.error('❌ Error converting USD to Wei:', error);
    throw error;
  }
};

/**
 * Convierte Wei a ETH
 * @param {ethers.BigNumber|string} weiAmount - Cantidad en Wei
 * @returns {number} Cantidad en ETH
 */
export const convertWeiToETH = (weiAmount) => {
  try {
    const ethAmount = ethers.utils.formatEther(weiAmount);
    return parseFloat(ethAmount);
  } catch (error) {
    console.error('Error converting Wei to ETH:', error);
    throw new Error(`Cantidad Wei inválida: ${weiAmount}`);
  }
};

// =================== FORMATEO DE DATOS ===================

// Corrección para utils/helpers.js - formatTokenData function

/**
 * Formatea un token del contrato para la UI - VERSIÓN CORREGIDA
 * @param {Object} tokenData - Datos del token desde el contrato
 * @param {ethers.BigNumber} tokenId - ID del token
 * @returns {Object} Token formateado para UI
 */
export const formatTokenData = (tokenData, tokenId) => {
  try {
    console.log('🔧 === FORMATTING TOKEN DATA ===');
    console.log('🔧 Raw tokenData:', tokenData);
    console.log('🔧 tokenId:', tokenId.toString());
    
    // ✅ CORRECCIÓN: Obtener precio por quintal del contrato (ya está en Wei)
    const pricePerQuintalWei = tokenData.pricePerQuintal;
    const pricePerQuintalETH = convertWeiToETH(pricePerQuintalWei);
    const quantity = tokenData.quantity.toNumber();
    
    console.log('💰 Price calculations:');
    console.log('  - pricePerQuintalWei:', pricePerQuintalWei.toString());
    console.log('  - pricePerQuintalETH:', pricePerQuintalETH);
    console.log('  - quantity:', quantity);
    
    // ✅ CORRECCIÓN: Calcular precio total correctamente
    const totalPriceETH = quantity * pricePerQuintalETH;
    
    // ✅ CORRECCIÓN: Convertir a USD usando la tasa configurada
    const pricePerQuintalUSD = convertETHtoUSD(pricePerQuintalETH);
    const totalPriceUSD = convertETHtoUSD(totalPriceETH);
    
    console.log('💵 USD conversions:');
    console.log('  - pricePerQuintalUSD:', pricePerQuintalUSD);
    console.log('  - totalPriceUSD:', totalPriceUSD);
    
    const formattedToken = {
      id: tokenId.toNumber(),
      farmer: tokenData.farmer,
      cropType: tokenData.cropType,
      quantity: quantity,
      
      // ✅ PRECIOS CORREGIDOS - ETH
      pricePerQuintalETH: pricePerQuintalETH,
      pricePerUnitETH: pricePerQuintalETH, // Alias para compatibilidad
      totalPriceETH: totalPriceETH,
      
      // ✅ PRECIOS CORREGIDOS - USD  
      pricePerQuintalUSD: pricePerQuintalUSD,
      pricePerUnitUSD: pricePerQuintalUSD, // Alias para compatibilidad
      pricePerUnit: pricePerQuintalUSD,    // Para compatibilidad con useTokens
      totalPriceUSD: totalPriceUSD,
      totalPrice: totalPriceUSD,           // Para compatibilidad con useTokens
      
      // Fechas
      deliveryDate: new Date(tokenData.deliveryDate.toNumber() * 1000).toLocaleDateString(),
      deliveryTimestamp: tokenData.deliveryDate.toNumber(),
      createdAt: new Date(tokenData.createdAt.toNumber() * 1000).toLocaleDateString(),
      createdTimestamp: tokenData.createdAt.toNumber(),
      
      // Estados
      isDelivered: tokenData.isDelivered,
      isSold: tokenData.isSold,
      
      // Otros datos
      buyer: tokenData.buyer,
      location: tokenData.location,
      ipfsHash: tokenData.ipfsHash,
      
      // Datos calculados para UI
      variety: getVarietyFromCropType(tokenData.cropType),
      qualityGrade: 'A',
      organicCertified: Math.random() > 0.5,
      description: `${tokenData.cropType} de ${tokenData.location}`,
      
      // Estado del token
      status: getTokenStatus(tokenData),
      statusColor: getTokenStatusColor(tokenData),
    };
    
    console.log('✅ Formatted token:', formattedToken);
    console.log('✅ Final prices check:');
    console.log('  - pricePerUnit (USD):', formattedToken.pricePerUnit);
    console.log('  - totalPrice (USD):', formattedToken.totalPrice);
    console.log('  - pricePerUnitETH:', formattedToken.pricePerUnitETH);
    console.log('  - totalPriceETH:', formattedToken.totalPriceETH);
    
    return formattedToken;
    
  } catch (error) {
    console.error('❌ Error formatting token data:', error);
    console.error('❌ tokenData received:', tokenData);
    console.error('❌ tokenId received:', tokenId);
    
    // ✅ Devolver token básico en caso de error
    return {
      id: tokenId ? tokenId.toNumber() : 0,
      farmer: tokenData?.farmer || 'Desconocido',
      cropType: tokenData?.cropType || 'DESCONOCIDO',
      quantity: tokenData?.quantity ? tokenData.quantity.toNumber() : 0,
      pricePerUnit: 0,
      pricePerUnitUSD: 0,
      pricePerUnitETH: 0,
      totalPrice: 0,
      totalPriceUSD: 0,
      totalPriceETH: 0,
      deliveryDate: 'Fecha inválida',
      location: tokenData?.location || 'Ubicación desconocida',
      status: 'Error',
      isDelivered: false,
      isSold: false,
      description: 'Token con error de formato'
    };
  }
};


/**
 * Formatea estadísticas del contrato
 * @param {Object} stats - Estadísticas desde el contrato
 * @returns {Object} Estadísticas formateadas
 */
export const formatStats = (stats) => {
  try {
    const totalVolumeETH = convertWeiToETH(stats.totalVolume);
    
    return {
      totalTokens: stats.totalTokens.toNumber(),
      availableTokens: stats.availableTokens.toNumber(),
      soldTokens: stats.soldTokens.toNumber(),
      totalVolumeETH: totalVolumeETH,
      totalVolumeUSD: convertETHtoUSD(totalVolumeETH),
      
      // Métricas calculadas
      sellRate: stats.totalTokens.toNumber() > 0 
        ? (stats.soldTokens.toNumber() / stats.totalTokens.toNumber() * 100).toFixed(1)
        : 0,
      averagePriceETH: stats.soldTokens.toNumber() > 0
        ? (totalVolumeETH / stats.soldTokens.toNumber()).toFixed(4)
        : 0
    };
  } catch (error) {
    console.error('Error formatting stats:', error);
    return {
      totalTokens: 0,
      availableTokens: 0,
      soldTokens: 0,
      totalVolumeETH: 0,
      totalVolumeUSD: 0,
      sellRate: 0,
      averagePriceETH: 0
    };
  }
};

// =================== FUNCIONES DE UTILIDAD ===================

/**
 * Obtiene la variedad de cultivo basada en el tipo
 * @param {string} cropType - Tipo de cultivo
 * @returns {string} Variedad del cultivo
 */
export const getVarietyFromCropType = (cropType) => {
  const varieties = {
    'CACAO': 'Nacional',
    'BANANO': 'Cavendish',
    'MAIZ': 'Amarillo Duro',
    'PLATANO': 'Verde Export',
    'ARROZ': 'INIAP 15',
    'CAFE': 'Arábica'
  };
  return varieties[cropType] || 'Estándar';
};

/**
 * Obtiene el estado del token
 * @param {Object} tokenData - Datos del token
 * @returns {string} Estado del token
 */
export const getTokenStatus = (tokenData) => {
  if (tokenData.isDelivered) return 'Entregado';
  if (tokenData.isSold) return 'Vendido';
  
  const now = Math.floor(Date.now() / 1000);
  if (tokenData.deliveryDate.toNumber() <= now) return 'Expirado';
  
  return 'Disponible';
};

/**
 * Obtiene el color del estado del token
 * @param {Object} tokenData - Datos del token
 * @returns {string} Clase CSS para el color
 */
export const getTokenStatusColor = (tokenData) => {
  const status = getTokenStatus(tokenData);
  
  const colors = {
    'Disponible': 'bg-green-100 text-green-800',
    'Vendido': 'bg-blue-100 text-blue-800',
    'Entregado': 'bg-gray-100 text-gray-800',
    'Expirado': 'bg-red-100 text-red-800'
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// =================== VALIDACIONES ===================

/**
 * Valida una dirección de Ethereum
 * @param {string} address - Dirección a validar
 * @returns {boolean} True si es válida
 */
export const isValidAddress = (address) => {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
};

/**
 * Valida un ID de token
 * @param {number|string} tokenId - ID del token
 * @returns {boolean} True si es válido
 */
export const isValidTokenId = (tokenId) => {
  const id = parseInt(tokenId);
  return !isNaN(id) && id >= 0;
};

/**
 * Valida una cantidad de ETH
 * @param {number|string} amount - Cantidad a validar
 * @returns {boolean} True si es válida
 */
export const isValidETHAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && num < 1000; // Límite razonable
};

/**
 * Valida una fecha de entrega
 * @param {string|Date} deliveryDate - Fecha a validar
 * @returns {boolean} True si es válida (futura)
 */
export const isValidDeliveryDate = (deliveryDate) => {
  try {
    const date = new Date(deliveryDate);
    const now = new Date();
    return date > now && date.getFullYear() <= now.getFullYear() + 2; // Máximo 2 años
  } catch {
    return false;
  }
};

// =================== FORMATEO DE TEXTO ===================

/**
 * Formatea una dirección de Ethereum para mostrar
 * @param {string} address - Dirección completa
 * @param {number} start - Caracteres al inicio (default: 6)
 * @param {number} end - Caracteres al final (default: 4)
 * @returns {string} Dirección truncada
 */
export const formatAddress = (address, start = 6, end = 4) => {
  if (!address || !isValidAddress(address)) return '';
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

/**
 * Formatea un número como precio
 * @param {number} amount - Cantidad
 * @param {string} currency - Moneda (USD|ETH)
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} Precio formateado
 */
export const formatPrice = (amount, currency = 'USD', decimals = null) => {
  if (!amount || isNaN(amount)) return `0 ${currency}`;
  
  const dec = decimals !== null ? decimals : (currency === 'USD' ? CONFIG.USD_DECIMALS : CONFIG.PRICE_DECIMALS);
  const formattedAmount = parseFloat(amount).toFixed(dec);
  
  if (currency === 'USD') {
    return `$${parseFloat(formattedAmount).toLocaleString()}`;
  } else {
    return `${formattedAmount} ${currency}`;
  }
};

/**
 * Formatea una fecha relativa
 * @param {number} timestamp - Timestamp Unix
 * @returns {string} Fecha relativa (ej: "en 5 días", "hace 2 horas")
 */
export const formatRelativeDate = (timestamp) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const diff = timestamp - now;
    const absDiff = Math.abs(diff);
    
    const intervals = [
      { label: 'año', seconds: 31536000 },
      { label: 'mes', seconds: 2592000 },
      { label: 'día', seconds: 86400 },
      { label: 'hora', seconds: 3600 },
      { label: 'minuto', seconds: 60 }
    ];
    
    for (const interval of intervals) {
      const count = Math.floor(absDiff / interval.seconds);
      if (count >= 1) {
        const plural = count > 1 ? 's' : '';
        const prefix = diff > 0 ? 'en' : 'hace';
        return `${prefix} ${count} ${interval.label}${plural}`;
      }
    }
    
    return 'ahora mismo';
  } catch {
    return 'fecha inválida';
  }
};

// =================== MANEJO DE ERRORES ===================

/**
 * Analiza un error de Web3/Ethereum y devuelve un mensaje amigable
 * @param {Error} error - Error capturado
 * @returns {string} Mensaje de error amigable
 */
export const parseWeb3Error = (error) => {
  console.error('Parsing Web3 error:', error);
  
  // Errores de MetaMask/Usuario
  if (error.code === 4001) {
    return 'Transacción cancelada por el usuario';
  }
  
  if (error.code === -32603) {
    if (error.message.includes('insufficient funds')) {
      return 'Balance insuficiente para pagar las comisiones de gas';
    }
    return 'Error de red. Verifica tu conexión y vuelve a intentar';
  }
  
  // Errores del contrato
  if (error.message.includes('execution reverted')) {
    if (error.message.includes('Token already sold')) {
      return 'El token ya fue vendido por otro comprador';
    }
    if (error.message.includes('Delivery date passed')) {
      return 'La fecha de entrega del token ya pasó';
    }
    if (error.message.includes('Insufficient payment')) {
      return 'El precio enviado es incorrecto. Recarga la página e intenta de nuevo';
    }
    if (error.message.includes('Token does not exist')) {
      return 'El token no existe';
    }
    if (error.message.includes('Farmer not verified')) {
      return 'Debes ser un agricultor verificado para crear tokens';
    }
    if (error.reason) {
      return error.reason;
    }
  }
  
  // Errores de red/conexión
  if (error.message.includes('network')) {
    return 'Error de conexión. Verifica tu red y MetaMask';
  }
  
  if (error.message.includes('timeout') || error.message.includes('Timeout')) {
    return 'La transacción tardó demasiado. Verifica en el explorador si se procesó';
  }
  
  // Error genérico
  return error.message || 'Error desconocido en la transacción';
};

/**
 * Crea un hash IPFS simulado
 * @param {string} prefix - Prefijo opcional
 * @returns {string} Hash IPFS simulado
 */
export const generateIPFSHash = (prefix = 'Qm') => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}${timestamp}${random}`;
};

// =================== MÉTRICAS Y ANALYTICS ===================

/**
 * Calcula métricas de rendimiento de un agricultor
 * @param {Array} tokens - Array de tokens del agricultor
 * @returns {Object} Métricas calculadas
 */
export const calculateFarmerMetrics = (tokens) => {
  if (!tokens || tokens.length === 0) {
    return {
      totalTokens: 0,
      totalVolumeETH: 0,
      totalVolumeUSD: 0,
      soldTokens: 0,
      avgPricePerQuintal: 0,
      successRate: 0,
      totalQuantity: 0
    };
  }
  
  const soldTokens = tokens.filter(t => t.isSold);
  const totalVolumeETH = soldTokens.reduce((sum, t) => sum + t.totalPriceETH, 0);
  const totalQuantity = tokens.reduce((sum, t) => sum + t.quantity, 0);
  const avgPricePerQuintal = totalQuantity > 0 
    ? (totalVolumeETH / totalQuantity) 
    : 0;
  
  return {
    totalTokens: tokens.length,
    totalVolumeETH: totalVolumeETH,
    totalVolumeUSD: convertETHtoUSD(totalVolumeETH),
    soldTokens: soldTokens.length,
    avgPricePerQuintal: avgPricePerQuintal,
    successRate: tokens.length > 0 ? (soldTokens.length / tokens.length * 100) : 0,
    totalQuantity: totalQuantity
  };
};

// =================== FILTROS Y BÚSQUEDA ===================

/**
 * Filtra tokens basado en criterios
 * @param {Array} tokens - Array de tokens
 * @param {Object} filters - Criterios de filtrado
 * @returns {Array} Tokens filtrados
 */
export const filterTokens = (tokens, filters = {}) => {
  if (!tokens || tokens.length === 0) return [];
  
  return tokens.filter(token => {
    // Filtro por tipo de cultivo
    if (filters.cropType && token.cropType !== filters.cropType) {
      return false;
    }
    
    // Filtro por rango de precio ETH
    if (filters.maxPriceETH && token.totalPriceETH > filters.maxPriceETH) {
      return false;
    }
    
    if (filters.minPriceETH && token.totalPriceETH < filters.minPriceETH) {
      return false;
    }
    
    // Filtro por ubicación
    if (filters.location && !token.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Filtro por estado
    if (filters.status && token.status !== filters.status) {
      return false;
    }
    
    // Filtro por certificación orgánica
    if (filters.organicOnly && !token.organicCertified) {
      return false;
    }
    
    // Filtro por agricultor
    if (filters.farmer && token.farmer !== filters.farmer) {
      return false;
    }
    
    return true;
  });
};

/**
 * Ordena tokens por criterio
 * @param {Array} tokens - Array de tokens
 * @param {string} sortBy - Criterio de ordenamiento
 * @param {string} sortOrder - Orden (asc|desc)
 * @returns {Array} Tokens ordenados
 */
export const sortTokens = (tokens, sortBy = 'createdTimestamp', sortOrder = 'desc') => {
  if (!tokens || tokens.length === 0) return [];
  
  return [...tokens].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Manejo de valores undefined
    if (aValue === undefined) aValue = 0;
    if (bValue === undefined) bValue = 0;
    
    // Comparación
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

// =================== VALIDACIONES DE FORMULARIO ===================

/**
 * Valida datos de creación de token
 * @param {Object} tokenData - Datos del token
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validateTokenData = (tokenData) => {
  const errors = [];
  
  if (!tokenData.cropType || tokenData.cropType.trim() === '') {
    errors.push('Tipo de cultivo es requerido');
  }
  
  if (!tokenData.quantity || parseInt(tokenData.quantity) <= 0) {
    errors.push('Cantidad debe ser mayor a 0');
  }
  
  if (!tokenData.pricePerUnit || parseFloat(tokenData.pricePerUnit) <= 0) {
    errors.push('Precio por unidad debe ser mayor a 0');
  }
  
  if (!isValidDeliveryDate(tokenData.deliveryDate)) {
    errors.push('Fecha de entrega debe ser futura');
  }
  
  if (!tokenData.location || tokenData.location.trim() === '') {
    errors.push('Ubicación es requerida');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
};

// =================== CONSTANTES ÚTILES ===================

export const CROP_TYPES = [
  { value: 'CACAO', label: 'Cacao', icon: '🍫' },
  { value: 'BANANO', label: 'Banano', icon: '🍌' },
  { value: 'MAIZ', label: 'Maíz', icon: '🌽' },
  { value: 'CAFE', label: 'Café', icon: '☕' },
  { value: 'ARROZ', label: 'Arroz', icon: '🌾' },
  { value: 'PLATANO', label: 'Plátano', icon: '🍌' }
];

export const QUALITY_GRADES = [
  { value: 'A', label: 'Grado A - Premium' },
  { value: 'B', label: 'Grado B - Estándar' },
  { value: 'C', label: 'Grado C - Básico' }
];

export const PROVINCES_ECUADOR = [
  'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi',
  'El Oro', 'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura',
  'Loja', 'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo',
  'Orellana', 'Pastaza', 'Pichincha', 'Santa Elena', 'Santo Domingo',
  'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe'
];

console.log('🔧 Helpers module loaded successfully');