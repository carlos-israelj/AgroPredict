// frontend/src/data/productData.js - VERSIÓN CORREGIDA
// ✅ CAMBIO PRINCIPAL: Eliminar precios hardcodeados que interfieren con entrada del usuario

export const productData = {
  CACAO: {
    name: 'Cacao Nacional',
    emoji: '🍫',
    unit: 'quintal',
    // ❌ REMOVIDO: currentPriceUSD: 140,
    // ❌ REMOVIDO: currentPriceETH: 0.056,
    varieties: ['Nacional', 'CCN-51', 'Trinitario', 'Arriba'],
    grades: ['Premium', 'A', 'B', 'C'],
    description: 'Cacao fino de aroma ecuatoriano',
    
    // ✅ NUEVO: Solo precios de referencia (no para usar en contratos)
    referencePrice: {
      min: 3.00,
      max: 6.00,
      typical: 4.50,
      unit: 'USD/quintal'
    },
    
    seasonality: {
      best_months: ['Mayo', 'Junio', 'Julio'],
      worst_months: ['Enero', 'Febrero', 'Marzo'],
      harvest_season: 'Mayo - Agosto'
    },
    
    insights: [
      '🌞 Mejor época para vender: Mayo - Julio (temporada seca)',
      '📈 Precio típico: $3-6 por quintal',
      '🌧️ Evita vender: Enero - Marzo (temporada lluviosa)',
      '📊 Demanda internacional alta en segundo semestre'
    ],
    
    // ✅ AGREGADO: Predicciones simuladas para PriceChart
    predictions: [
      { month: 'Ago 2025', priceUSD: 4.2, priceETH: 0.00168, confidence: 85, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 4.8, priceETH: 0.00192, confidence: 82, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 5.5, priceETH: 0.0022, confidence: 78, trend: 'up' },
      { month: 'Nov 2025', priceUSD: 5.2, priceETH: 0.00208, confidence: 75, trend: 'down' },
      { month: 'Dic 2025', priceUSD: 4.8, priceETH: 0.00192, confidence: 80, trend: 'down' },
      { month: 'Ene 2026', priceUSD: 4.5, priceETH: 0.0018, confidence: 72, trend: 'down' },
      { month: 'Feb 2026', priceUSD: 4.2, priceETH: 0.00168, confidence: 70, trend: 'down' },
      { month: 'Mar 2026', priceUSD: 4.0, priceETH: 0.0016, confidence: 68, trend: 'down' },
      { month: 'Abr 2026', priceUSD: 4.5, priceETH: 0.0018, confidence: 75, trend: 'up' },
      { month: 'May 2026', priceUSD: 5.0, priceETH: 0.002, confidence: 82, trend: 'up' },
      { month: 'Jun 2026', priceUSD: 5.8, priceETH: 0.00232, confidence: 85, trend: 'up' },
      { month: 'Jul 2026', priceUSD: 6.0, priceETH: 0.0024, confidence: 88, trend: 'up' }
    ]
  },

  BANANO: {
    name: 'Banano Export',
    emoji: '🍌',
    unit: 'quintal',
    // ❌ REMOVIDO: currentPriceUSD: 25,
    // ❌ REMOVIDO: currentPriceETH: 0.01,
    varieties: ['Cavendish', 'Williams', 'Gran Enano'],
    grades: ['A', 'B'],
    description: 'Banano de exportación premium',
    
    referencePrice: {
      min: 2.00,
      max: 4.00,
      typical: 3.00,
      unit: 'USD/quintal'
    },
    
    seasonality: {
      best_months: ['Marzo', 'Abril', 'Agosto', 'Septiembre'],
      worst_months: ['Junio', 'Julio', 'Diciembre'],
      harvest_season: 'Todo el año (cosecha continua)'
    },
    
    insights: [
      '🚢 Mejor época para vender: Marzo - Abril (alta demanda exportación)',
      '📈 Precio típico: $2-4 por quintal',
      '🌧️ Precios bajos: Junio - Julio (exceso por lluvias)',
      '🌍 Mercado internacional influye en precios locales'
    ],
    
    // ✅ AGREGADO: Predicciones simuladas para PriceChart
    predictions: [
      { month: 'Ago 2025', priceUSD: 3.2, priceETH: 0.00128, confidence: 90, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 3.6, priceETH: 0.00144, confidence: 88, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 3.4, priceETH: 0.00136, confidence: 85, trend: 'down' },
      { month: 'Nov 2025', priceUSD: 3.0, priceETH: 0.0012, confidence: 82, trend: 'down' },
      { month: 'Dic 2025', priceUSD: 2.8, priceETH: 0.00112, confidence: 78, trend: 'down' },
      { month: 'Ene 2026', priceUSD: 3.0, priceETH: 0.0012, confidence: 80, trend: 'up' },
      { month: 'Feb 2026', priceUSD: 3.2, priceETH: 0.00128, confidence: 85, trend: 'up' },
      { month: 'Mar 2026', priceUSD: 3.8, priceETH: 0.00152, confidence: 90, trend: 'up' },
      { month: 'Abr 2026', priceUSD: 4.0, priceETH: 0.0016, confidence: 92, trend: 'up' },
      { month: 'May 2026', priceUSD: 3.6, priceETH: 0.00144, confidence: 88, trend: 'down' },
      { month: 'Jun 2026', priceUSD: 3.2, priceETH: 0.00128, confidence: 82, trend: 'down' },
      { month: 'Jul 2026', priceUSD: 3.0, priceETH: 0.0012, confidence: 78, trend: 'down' }
    ]
  },

  CAFE: {
    name: 'Café Arábica',
    emoji: '☕',
    unit: 'quintal',
    // ❌ REMOVIDO: currentPriceUSD: 320,
    // ❌ REMOVIDO: currentPriceETH: 0.128,
    varieties: ['Arábica', 'Robusta', 'Bourbon', 'Typica'],
    grades: ['Especial', 'Superior', 'Corriente'],
    description: 'Café arábica de altura',
    
    referencePrice: {
      min: 10.00,
      max: 25.00,
      typical: 15.00,
      unit: 'USD/quintal'
    },
    
    seasonality: {
      best_months: ['Junio', 'Julio', 'Agosto'],
      worst_months: ['Enero', 'Febrero', 'Marzo'],
      harvest_season: 'Mayo - Septiembre'
    },
    
    insights: [
      '☕ Mejor época para vender: Mayo - Julio (demanda internacional alta)',
      '📈 Precio típico: $10-25 por quintal',
      '🌧️ Precios bajos: Diciembre - Febrero (abundante oferta)',
      '🌍 Precio muy influenciado por mercados internacionales'
    ],
    
    // ✅ AGREGADO: Predicciones simuladas para PriceChart
    predictions: [
      { month: 'Ago 2025', priceUSD: 16.5, priceETH: 0.0066, confidence: 88, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 18.0, priceETH: 0.0072, confidence: 85, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 17.2, priceETH: 0.00688, confidence: 80, trend: 'down' },
      { month: 'Nov 2025', priceUSD: 15.8, priceETH: 0.00632, confidence: 78, trend: 'down' },
      { month: 'Dic 2025', priceUSD: 14.5, priceETH: 0.0058, confidence: 75, trend: 'down' },
      { month: 'Ene 2026', priceUSD: 13.8, priceETH: 0.00552, confidence: 72, trend: 'down' },
      { month: 'Feb 2026', priceUSD: 15.2, priceETH: 0.00608, confidence: 78, trend: 'up' },
      { month: 'Mar 2026', priceUSD: 17.5, priceETH: 0.007, confidence: 82, trend: 'up' },
      { month: 'Abr 2026', priceUSD: 19.8, priceETH: 0.00792, confidence: 85, trend: 'up' },
      { month: 'May 2026', priceUSD: 22.0, priceETH: 0.0088, confidence: 88, trend: 'up' },
      { month: 'Jun 2026', priceUSD: 24.5, priceETH: 0.0098, confidence: 90, trend: 'up' },
      { month: 'Jul 2026', priceUSD: 23.8, priceETH: 0.00952, confidence: 88, trend: 'down' }
    ]
  },

  MAIZ: {
    name: 'Maíz Amarillo',
    emoji: '🌽',
    unit: 'quintal',
    varieties: ['Amarillo Duro', 'Blanco', 'Morado', 'Dulce'],
    grades: ['Extra', 'Primera', 'Segunda'],
    description: 'Maíz amarillo duro para consumo animal',
    
    referencePrice: {
      min: 1.50,
      max: 3.00,
      typical: 2.25,
      unit: 'USD/quintal'
    },
    
    seasonality: {
      best_months: ['Abril', 'Mayo', 'Septiembre'],
      worst_months: ['Diciembre', 'Enero', 'Febrero'],
      harvest_season: 'Abril - Mayo, Septiembre - Octubre'
    },
    
    insights: [
      '🌾 Mejor época para vender: Abril - Mayo (escasez post-cosecha)',
      '📈 Precio típico: $1.50-3 por quintal',
      '❄️ Precios bajos: Diciembre - Febrero (sobreoferta)',
      '🐄 Demanda alta por industria avícola y ganadera'
    ],
    
    // ✅ AGREGADO: Predicciones simuladas para PriceChart
    predictions: [
      { month: 'Ago 2025', priceUSD: 2.4, priceETH: 0.00096, confidence: 88, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 2.8, priceETH: 0.00112, confidence: 85, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 3.0, priceETH: 0.0012, confidence: 82, trend: 'up' },
      { month: 'Nov 2025', priceUSD: 2.6, priceETH: 0.00104, confidence: 80, trend: 'down' },
      { month: 'Dic 2025', priceUSD: 2.2, priceETH: 0.00088, confidence: 75, trend: 'down' },
      { month: 'Ene 2026', priceUSD: 1.8, priceETH: 0.00072, confidence: 72, trend: 'down' },
      { month: 'Feb 2026', priceUSD: 1.6, priceETH: 0.00064, confidence: 70, trend: 'down' },
      { month: 'Mar 2026', priceUSD: 2.0, priceETH: 0.0008, confidence: 75, trend: 'up' },
      { month: 'Abr 2026', priceUSD: 2.6, priceETH: 0.00104, confidence: 85, trend: 'up' },
      { month: 'May 2026', priceUSD: 2.9, priceETH: 0.00116, confidence: 88, trend: 'up' },
      { month: 'Jun 2026', priceUSD: 2.5, priceETH: 0.001, confidence: 82, trend: 'down' },
      { month: 'Jul 2026', priceUSD: 2.2, priceETH: 0.00088, confidence: 78, trend: 'down' }
    ]
  },

  ARROZ: {
    name: 'Arroz INIAP',
    emoji: '🌾',
    unit: 'quintal',
    varieties: ['INIAP 15', 'INIAP 17', 'SFL-011', 'Fedearroz 67'],
    grades: ['Extra', 'Primera', 'Segunda'],
    description: 'Arroz de grano largo',
    
    referencePrice: {
      min: 1.80,
      max: 3.50,
      typical: 2.65,
      unit: 'USD/quintal'
    },
    
    seasonality: {
      best_months: ['Febrero', 'Marzo', 'Agosto'],
      worst_months: ['Mayo', 'Junio', 'Octubre'],
      harvest_season: 'Diciembre - Febrero, Junio - Agosto'
    },
    
    insights: [
      '🍚 Mejor época para vender: Enero - Marzo (escasez estacional)',
      '📈 Precio típico: $1.80-3.50 por quintal',
      '📉 Precios bajos: Mayo - Junio (cosecha abundante)',
      '🏭 Demanda constante por industrias alimentarias'
    ],
    
    // ✅ AGREGADO: Predicciones simuladas para PriceChart
    predictions: [
      { month: 'Ago 2025', priceUSD: 2.8, priceETH: 0.00112, confidence: 85, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 3.1, priceETH: 0.00124, confidence: 82, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 2.6, priceETH: 0.00104, confidence: 78, trend: 'down' },
      { month: 'Nov 2025', priceUSD: 2.9, priceETH: 0.00116, confidence: 80, trend: 'up' },
      { month: 'Dic 2025', priceUSD: 3.2, priceETH: 0.00128, confidence: 85, trend: 'up' },
      { month: 'Ene 2026', priceUSD: 3.4, priceETH: 0.00136, confidence: 88, trend: 'up' },
      { month: 'Feb 2026', priceUSD: 3.5, priceETH: 0.0014, confidence: 90, trend: 'up' },
      { month: 'Mar 2026', priceUSD: 3.2, priceETH: 0.00128, confidence: 85, trend: 'down' },
      { month: 'Abr 2026', priceUSD: 2.8, priceETH: 0.00112, confidence: 80, trend: 'down' },
      { month: 'May 2026', priceUSD: 2.4, priceETH: 0.00096, confidence: 75, trend: 'down' },
      { month: 'Jun 2026', priceUSD: 2.6, priceETH: 0.00104, confidence: 78, trend: 'up' },
      { month: 'Jul 2026', priceUSD: 2.9, priceETH: 0.00116, confidence: 82, trend: 'up' }
    ]
  },

  PLATANO: {
    name: 'Plátano Verde',
    emoji: '🍌',
    unit: 'quintal',
    varieties: ['Barraganete', 'Maqueño', 'Dominico'],
    grades: ['Extra', 'Primera', 'Segunda'],
    description: 'Plátano verde para exportación',
    
    referencePrice: {
      min: 1.20,
      max: 2.50,
      typical: 1.85,
      unit: 'USD/quintal'
    },
    
    seasonality: {
      best_months: ['Marzo', 'Abril', 'Agosto', 'Septiembre'],
      worst_months: ['Junio', 'Julio', 'Diciembre'],
      harvest_season: 'Todo el año'
    },
    
    insights: [
      '🚢 Mejor época para vender: Marzo - Abril (alta demanda)',
      '📈 Precio típico: $1.20-2.50 por quintal',
      '🌧️ Precios bajos: Junio - Julio (exceso)',
      '🌍 Mercado de exportación muy importante'
    ],
    
    // ✅ AGREGADO: Predicciones simuladas para PriceChart
    predictions: [
      { month: 'Ago 2025', priceUSD: 1.9, priceETH: 0.00076, confidence: 85, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 2.1, priceETH: 0.00084, confidence: 82, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 1.8, priceETH: 0.00072, confidence: 78, trend: 'down' },
      { month: 'Nov 2025', priceUSD: 1.6, priceETH: 0.00064, confidence: 75, trend: 'down' },
      { month: 'Dic 2025', priceUSD: 1.4, priceETH: 0.00056, confidence: 72, trend: 'down' },
      { month: 'Ene 2026', priceUSD: 1.6, priceETH: 0.00064, confidence: 78, trend: 'up' },
      { month: 'Feb 2026', priceUSD: 1.9, priceETH: 0.00076, confidence: 82, trend: 'up' },
      { month: 'Mar 2026', priceUSD: 2.3, priceETH: 0.00092, confidence: 88, trend: 'up' },
      { month: 'Abr 2026', priceUSD: 2.5, priceETH: 0.001, confidence: 90, trend: 'up' },
      { month: 'May 2026', priceUSD: 2.2, priceETH: 0.00088, confidence: 85, trend: 'down' },
      { month: 'Jun 2026', priceUSD: 1.8, priceETH: 0.00072, confidence: 78, trend: 'down' },
      { month: 'Jul 2026', priceUSD: 1.6, priceETH: 0.00064, confidence: 75, trend: 'down' }
    ]
  }
};

// ✅ FUNCIONES HELPER ACTUALIZADAS
export const getReferencePrice = (cropType, type = 'typical') => {
  const crop = productData[cropType];
  if (!crop || !crop.referencePrice) {
    return 0;
  }
  return crop.referencePrice[type] || crop.referencePrice.typical;
};

export const getPriceRange = (cropType) => {
  const crop = productData[cropType];
  if (!crop || !crop.referencePrice) {
    return 'No disponible';
  }
  return `$${crop.referencePrice.min} - $${crop.referencePrice.max}`;
};

export const isPriceReasonable = (cropType, price) => {
  const crop = productData[cropType];
  if (!crop || !crop.referencePrice) {
    return true; // Si no hay datos, aceptar cualquier precio
  }
  
  // Rango más amplio para validación (permite precios fuera del rango típico)
  const minPrice = crop.referencePrice.min * 0.3; // 30% del mínimo
  const maxPrice = crop.referencePrice.max * 3.0; // 300% del máximo
  
  return price >= minPrice && price <= maxPrice;
};

// ✅ FUNCIONES ADICIONALES para mejor UX
export const getInsights = (cropType) => {
  const crop = productData[cropType];
  return crop?.insights || [];
};

export const getSeasonalityInfo = (cropType) => {
  const crop = productData[cropType];
  return crop?.seasonality || null;
};

export const getAllCropTypes = () => {
  return Object.keys(productData);
};

export const getCropInfo = (cropType) => {
  return productData[cropType] || null;
};

// ✅ FUNCIÓN para mostrar advertencias de precio
export const getPriceWarning = (cropType, price) => {
  const crop = productData[cropType];
  if (!crop || !crop.referencePrice) {
    return null;
  }
  
  const priceNum = parseFloat(price);
  const { min, max } = crop.referencePrice;
  
  if (priceNum < min * 0.7) {
    return {
      type: 'warning',
      message: `Precio muy bajo. El rango típico es ${min}-${max}/${crop.unit}`
    };
  }
  
  if (priceNum > max * 1.5) {
    return {
      type: 'warning', 
      message: `Precio muy alto. El rango típico es ${min}-${max}/${crop.unit}`
    };
  }
  
  if (priceNum >= min && priceNum <= max) {
    return {
      type: 'success',
      message: `Precio dentro del rango típico de mercado`
    };
  }
  
  return null;
};

// ✅ FUNCIONES CORREGIDAS: Para compatibilidad con PricePredictionSystem
export const getProductBestMonth = (productKey) => {
  const product = productData[productKey];
  if (!product || !product.predictions) return null;
  
  // Encontrar el mes con el precio más alto en las predicciones
  return product.predictions.reduce((max, current) => 
    current.priceUSD > max.priceUSD ? current : max
  );
};

export const getProductWorstMonth = (productKey) => {
  const product = productData[productKey];
  if (!product || !product.predictions) return null;
  
  // Encontrar el mes con el precio más bajo en las predicciones
  return product.predictions.reduce((min, current) => 
    current.priceUSD < min.priceUSD ? current : min
  );
};

export const calculatePotentialGain = (productKey) => {
  const bestMonth = getProductBestMonth(productKey);
  const worstMonth = getProductWorstMonth(productKey);
  
  if (!bestMonth || !worstMonth) return null;
  
  const gainETH = bestMonth.priceETH - worstMonth.priceETH;
  const gainUSD = bestMonth.priceUSD - worstMonth.priceUSD;
  const percentage = ((gainUSD / worstMonth.priceUSD) * 100).toFixed(1);
  
  return {
    amountETH: gainETH.toFixed(6),
    amountUSD: gainUSD.toFixed(1),
    percentage,
    bestMonth,
    worstMonth
  };
};

// ✅ NUEVA FUNCIÓN: Obtener precio actual (primer elemento de predicciones)
export const getCurrentPrice = (productKey) => {
  const product = productData[productKey];
  if (!product || !product.predictions || product.predictions.length === 0) {
    return product?.referencePrice?.typical || 0;
  }
  
  // Usar el primer elemento de predicciones como precio "actual"
  return product.predictions[0].priceUSD;
};

// ✅ FUNCIONES LEGACY: Para compatibilidad con código existente
export const convertUSDtoETH = (usdAmount, ethUsdRate = 2500) => {
  return (usdAmount / ethUsdRate).toFixed(6);
};

export const convertETHtoUSD = (ethAmount, ethUsdRate = 2500) => {
  return (ethAmount * ethUsdRate).toFixed(2);
};

console.log('📊 ProductData loaded without hardcoded prices');