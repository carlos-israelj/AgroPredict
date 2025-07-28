// Base de datos de productos agrícolas con precios en USD
export const productData = {
  CACAO: {  // Cambiar de 'cacao' a 'CACAO' para consistencia con el contrato
    name: 'Cacao',
    currentPriceUSD: 140,  // $140 USD por quintal
    currentPriceETH: 0.056, // ~$140 USD convertido a ETH (asumiendo 1 ETH = $2500)
    unit: 'quintal',
    emoji: '🍫',
    description: 'Cacao fino de aroma ecuatoriano',
    varieties: ['Nacional', 'CCN-51', 'Trinitario', 'Arriba'],
    grades: ['Premium', 'A', 'B', 'C'],
    seasonality: {
      best_months: ['Mayo', 'Junio', 'Julio'],
      worst_months: ['Enero', 'Febrero', 'Marzo'],
      harvest_season: 'Mayo - Agosto'
    },
    predictions: [
      { month: 'Ago 2025', priceUSD: 142, priceETH: 0.0568, confidence: 85, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 148, priceETH: 0.0592, confidence: 82, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 155, priceETH: 0.062, confidence: 78, trend: 'up' },
      { month: 'Nov 2025', priceUSD: 162, priceETH: 0.0648, confidence: 75, trend: 'up' },
      { month: 'Dic 2025', priceUSD: 168, priceETH: 0.0672, confidence: 80, trend: 'up' },
      { month: 'Ene 2026', priceUSD: 165, priceETH: 0.066, confidence: 72, trend: 'down' },
      { month: 'Feb 2026', priceUSD: 158, priceETH: 0.0632, confidence: 70, trend: 'down' },
      { month: 'Mar 2026', priceUSD: 152, priceETH: 0.0608, confidence: 68, trend: 'down' },
      { month: 'Abr 2026', priceUSD: 145, priceETH: 0.058, confidence: 75, trend: 'down' },
      { month: 'May 2026', priceUSD: 150, priceETH: 0.06, confidence: 82, trend: 'up' },
      { month: 'Jun 2026', priceUSD: 165, priceETH: 0.066, confidence: 85, trend: 'up' },
      { month: 'Jul 2026', priceUSD: 175, priceETH: 0.07, confidence: 88, trend: 'up' }
    ],
    insights: [
      '🌞 Mejor época para vender: Mayo - Julio (temporada seca)',
      '📈 Pico histórico: $175/quintal en Julio 2026',
      '🌧️ Evita vender: Enero - Marzo (temporada lluviosa)',
      '📊 Demanda internacional alta en segundo semestre'
    ]
  },
  BANANO: {  // Cambiar de 'platano' a 'BANANO' para consistencia
    name: 'Banano',  // Cambiar de 'Plátano Verde' a 'Banano'
    currentPriceUSD: 25,  // Ajustar precio para banano (más alto que plátano)
    currentPriceETH: 0.01, // ~$25 USD
    unit: 'quintal',  // Cambiar de 'caja (22kg)' a 'quintal' para consistencia
    emoji: '🍌',
    description: 'Banano Cavendish para exportación',
    varieties: ['Cavendish', 'Grand Naine', 'Williams', 'Valery'],
    grades: ['Export', 'Nacional', 'Segunda'],
    seasonality: {
      best_months: ['Marzo', 'Abril', 'Agosto', 'Septiembre'],
      worst_months: ['Junio', 'Julio', 'Diciembre'],
      harvest_season: 'Todo el año (cosecha continua)'
    },
    predictions: [
      { month: 'Ago 2025', priceUSD: 26, priceETH: 0.0104, confidence: 90, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 28, priceETH: 0.0112, confidence: 88, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 27, priceETH: 0.0108, confidence: 85, trend: 'down' },
      { month: 'Nov 2025', priceUSD: 25, priceETH: 0.01, confidence: 82, trend: 'down' },
      { month: 'Dic 2025', priceUSD: 23, priceETH: 0.0092, confidence: 78, trend: 'down' },
      { month: 'Ene 2026', priceUSD: 24, priceETH: 0.0096, confidence: 80, trend: 'up' },
      { month: 'Feb 2026', priceUSD: 26, priceETH: 0.0104, confidence: 85, trend: 'up' },
      { month: 'Mar 2026', priceUSD: 29, priceETH: 0.0116, confidence: 90, trend: 'up' },
      { month: 'Abr 2026', priceUSD: 31, priceETH: 0.0124, confidence: 92, trend: 'up' },
      { month: 'May 2026', priceUSD: 30, priceETH: 0.012, confidence: 88, trend: 'down' },
      { month: 'Jun 2026', priceUSD: 27, priceETH: 0.0108, confidence: 82, trend: 'down' },
      { month: 'Jul 2026', priceUSD: 25, priceETH: 0.01, confidence: 78, trend: 'down' }
    ],
    insights: [
      '🚢 Mejor época para vender: Marzo - Abril (alta demanda exportación)',
      '📈 Pico proyectado: $31/quintal en Abril 2026',
      '🌧️ Precios bajos: Junio - Julio (exceso por lluvias)',
      '🌍 Mercado internacional influye en precios locales'
    ]
  },
  MAIZ: {  // Cambiar de 'maiz' a 'MAIZ'
    name: 'Maíz Amarillo',
    currentPriceUSD: 18,
    currentPriceETH: 0.0072, // ~$18 USD
    unit: 'quintal',
    emoji: '🌽',
    description: 'Maíz amarillo duro para consumo animal',
    varieties: ['Amarillo Duro', 'Blanco', 'Morado', 'Dulce'],
    grades: ['Extra', 'Primera', 'Segunda'],
    seasonality: {
      best_months: ['Abril', 'Mayo', 'Septiembre'],
      worst_months: ['Diciembre', 'Enero', 'Febrero'],
      harvest_season: 'Abril - Mayo, Septiembre - Octubre'
    },
    predictions: [
      { month: 'Ago 2025', priceUSD: 19, priceETH: 0.0076, confidence: 88, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 22, priceETH: 0.0088, confidence: 85, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 25, priceETH: 0.01, confidence: 82, trend: 'up' },
      { month: 'Nov 2025', priceUSD: 23, priceETH: 0.0092, confidence: 80, trend: 'down' },
      { month: 'Dic 2025', priceUSD: 20, priceETH: 0.008, confidence: 75, trend: 'down' },
      { month: 'Ene 2026', priceUSD: 17, priceETH: 0.0068, confidence: 72, trend: 'down' },
      { month: 'Feb 2026', priceUSD: 16, priceETH: 0.0064, confidence: 70, trend: 'down' },
      { month: 'Mar 2026', priceUSD: 18, priceETH: 0.0072, confidence: 75, trend: 'up' },
      { month: 'Abr 2026', priceUSD: 21, priceETH: 0.0084, confidence: 85, trend: 'up' },
      { month: 'May 2026', priceUSD: 24, priceETH: 0.0096, confidence: 88, trend: 'up' },
      { month: 'Jun 2026', priceUSD: 22, priceETH: 0.0088, confidence: 82, trend: 'down' },
      { month: 'Jul 2026', priceUSD: 20, priceETH: 0.008, confidence: 78, trend: 'down' }
    ],
    insights: [
      '🌾 Mejor época para vender: Abril - Mayo (escasez post-cosecha)',
      '📈 Pico esperado: $25/quintal en Octubre 2025',
      '❄️ Precios bajos: Diciembre - Febrero (sobreoferta)',
      '🐄 Demanda alta por industria avícola y ganadera'
    ]
  },
  ARROZ: {  // Cambiar de 'arroz' a 'ARROZ'
    name: 'Arroz',
    currentPriceUSD: 35,
    currentPriceETH: 0.014, // ~$35 USD
    unit: 'quintal',
    emoji: '🌾',
    description: 'Arroz de grano largo',
    varieties: ['INIAP 15', 'INIAP 17', 'SFL-011', 'Fedearroz 67'],
    grades: ['Extra', 'Primera', 'Segunda'],
    seasonality: {
      best_months: ['Febrero', 'Marzo', 'Agosto'],
      worst_months: ['Mayo', 'Junio', 'Octubre'],
      harvest_season: 'Diciembre - Febrero, Junio - Agosto'
    },
    predictions: [
      { month: 'Ago 2025', priceUSD: 36, priceETH: 0.0144, confidence: 85, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 38, priceETH: 0.0152, confidence: 82, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 33, priceETH: 0.0132, confidence: 78, trend: 'down' },
      { month: 'Nov 2025', priceUSD: 35, priceETH: 0.014, confidence: 80, trend: 'up' },
      { month: 'Dic 2025', priceUSD: 37, priceETH: 0.0148, confidence: 85, trend: 'up' },
      { month: 'Ene 2026', priceUSD: 39, priceETH: 0.0156, confidence: 88, trend: 'up' },
      { month: 'Feb 2026', priceUSD: 42, priceETH: 0.0168, confidence: 90, trend: 'up' },
      { month: 'Mar 2026', priceUSD: 40, priceETH: 0.016, confidence: 85, trend: 'down' },
      { month: 'Abr 2026', priceUSD: 36, priceETH: 0.0144, confidence: 80, trend: 'down' },
      { month: 'May 2026', priceUSD: 32, priceETH: 0.0128, confidence: 75, trend: 'down' },
      { month: 'Jun 2026', priceUSD: 34, priceETH: 0.0136, confidence: 78, trend: 'up' },
      { month: 'Jul 2026', priceUSD: 37, priceETH: 0.0148, confidence: 82, trend: 'up' }
    ],
    insights: [
      '🍚 Mejor época para vender: Enero - Marzo (escasez estacional)',
      '📈 Pico esperado: $42/quintal en Febrero 2026',
      '📉 Precios bajos: Mayo - Junio (cosecha abundante)',
      '🏭 Demanda constante por industrias alimentarias'
    ]
  },
  CAFE: {  // Cambiar de 'cafe' a 'CAFE'
    name: 'Café',
    currentPriceUSD: 320,
    currentPriceETH: 0.128, // ~$320 USD
    unit: 'quintal',
    emoji: '☕',
    description: 'Café arábica de altura',
    varieties: ['Arábica', 'Robusta', 'Bourbon', 'Typica'],
    grades: ['Especial', 'Superior', 'Corriente'],
    seasonality: {
      best_months: ['Junio', 'Julio', 'Agosto'],
      worst_months: ['Enero', 'Febrero', 'Marzo'],
      harvest_season: 'Mayo - Septiembre'
    },
    predictions: [
      { month: 'Ago 2025', priceUSD: 335, priceETH: 0.134, confidence: 88, trend: 'up' },
      { month: 'Sep 2025', priceUSD: 340, priceETH: 0.136, confidence: 85, trend: 'up' },
      { month: 'Oct 2025', priceUSD: 325, priceETH: 0.13, confidence: 80, trend: 'down' },
      { month: 'Nov 2025', priceUSD: 315, priceETH: 0.126, confidence: 78, trend: 'down' },
      { month: 'Dic 2025', priceUSD: 310, priceETH: 0.124, confidence: 75, trend: 'down' },
      { month: 'Ene 2026', priceUSD: 305, priceETH: 0.122, confidence: 72, trend: 'down' },
      { month: 'Feb 2026', priceUSD: 315, priceETH: 0.126, confidence: 78, trend: 'up' },
      { month: 'Mar 2026', priceUSD: 330, priceETH: 0.132, confidence: 82, trend: 'up' },
      { month: 'Abr 2026', priceUSD: 345, priceETH: 0.138, confidence: 85, trend: 'up' },
      { month: 'May 2026', priceUSD: 360, priceETH: 0.144, confidence: 88, trend: 'up' },
      { month: 'Jun 2026', priceUSD: 370, priceETH: 0.148, confidence: 90, trend: 'up' },
      { month: 'Jul 2026', priceUSD: 365, priceETH: 0.146, confidence: 88, trend: 'down' }
    ],
    insights: [
      '☕ Mejor época para vender: Mayo - Julio (demanda internacional alta)',
      '📈 Pico proyectado: $370/quintal en Junio 2026',
      '🌧️ Precios bajos: Diciembre - Febrero (abundante oferta)',
      '🌍 Precio muy influenciado por mercados internacionales'
    ]
  }
};

// Función para convertir USD a ETH (usando tasa de cambio simulada)
export const convertUSDtoETH = (usdAmount, ethUsdRate = 2500) => {
  return (usdAmount / ethUsdRate).toFixed(6);
};

// Función para convertir ETH a USD
export const convertETHtoUSD = (ethAmount, ethUsdRate = 2500) => {
  return (ethAmount * ethUsdRate).toFixed(2);
};

// Utilidades para trabajar con productos (actualizadas)
export const getProductBestMonth = (productKey) => {
  const product = productData[productKey];
  if (!product) return null;
  return product.predictions.reduce((max, current) => 
    current.priceETH > max.priceETH ? current : max
  );
};

export const getProductWorstMonth = (productKey) => {
  const product = productData[productKey];
  if (!product) return null;
  return product.predictions.reduce((min, current) => 
    current.priceETH < min.priceETH ? current : min
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