// config/index.js - Configuración centralizada
export const CONFIG = {
  // Configuración del contrato
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  CHAIN_ID: parseInt(process.env.REACT_APP_CHAIN_ID) || 534351,
  NETWORK: process.env.REACT_APP_NETWORK || 'scrollSepolia',
  
  // Configuración de precios
  ETH_USD_RATE: 2500, // 1 ETH = $2500 USD
  
  // Configuración de gas
  GAS_MULTIPLIER: 1.1, // 10% extra de gas
  DEFAULT_GAS_LIMIT: 300000,
  TRANSACTION_TIMEOUT: 120000, // 2 minutos
  
  // Configuración de UI
  PRICE_DECIMALS: 6,
  USD_DECIMALS: 2,
  
  // URLs
  IPFS_GATEWAY: 'https://ipfs.io/ipfs/',
  EXPLORER_URL: process.env.REACT_APP_EXPLORER_URL || 'https://sepolia.scrollscan.com',
};

// Configuración de redes
export const NETWORKS = {
  scrollSepolia: {
    chainId: '0x8274F', // 534351 en hex
    chainName: 'Scroll Sepolia Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://sepolia-rpc.scroll.io/'],
    blockExplorerUrls: ['https://sepolia.scrollscan.com/'],
  },
  scroll: {
    chainId: '0x82750', // 534352 en hex
    chainName: 'Scroll',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.scroll.io/'],
    blockExplorerUrls: ['https://scrollscan.com/'],
  }
};

// Validar configuración al cargar
export const validateConfig = () => {
  const errors = [];
  
  if (!CONFIG.CONTRACT_ADDRESS) {
    errors.push('REACT_APP_CONTRACT_ADDRESS no está definido');
  }
  
  if (!CONFIG.CHAIN_ID) {
    errors.push('REACT_APP_CHAIN_ID no está definido');
  }
  
  if (!NETWORKS[CONFIG.NETWORK]) {
    errors.push(`Red ${CONFIG.NETWORK} no está configurada`);
  }
  
  if (errors.length > 0) {
    console.error('❌ Errores de configuración:', errors);
    throw new Error('Configuración inválida: ' + errors.join(', '));
  }
  
  console.log('✅ Configuración validada exitosamente');
  return true;
};

// Debug de configuración
console.log('🔧 CONFIG loaded:', {
  CONTRACT_ADDRESS: CONFIG.CONTRACT_ADDRESS,
  CHAIN_ID: CONFIG.CHAIN_ID,
  NETWORK: CONFIG.NETWORK
});