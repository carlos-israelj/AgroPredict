import { ethers } from 'ethers';

// Información del contrato
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '';

// ABI completo del contrato verificado
export const CONTRACT_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"farmer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"}],"name":"CropDelivered","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"farmer","type":"address"},{"indexed":false,"internalType":"string","name":"cropType","type":"string"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"pricePerQuintal","type":"uint256"}],"name":"CropTokenMinted","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"totalPrice","type":"uint256"}],"name":"CropTokenSold","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"farmer","type":"address"}],"name":"FarmerVerified","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"cropType","type":"string"},{"indexed":false,"internalType":"uint256","name":"predictedPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"confidence","type":"uint256"}],"name":"PricePredictionUpdated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"buyCropToken","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"confirmDelivery","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"cropTokens","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"farmer","type":"address"},{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"uint256","name":"pricePerQuintal","type":"uint256"},{"internalType":"uint256","name":"deliveryDate","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"bool","name":"isDelivered","type":"bool"},{"internalType":"bool","name":"isSold","type":"bool"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"farmerTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getAvailableTokens","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getCropToken","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"farmer","type":"address"},{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"uint256","name":"pricePerQuintal","type":"uint256"},{"internalType":"uint256","name":"deliveryDate","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"bool","name":"isDelivered","type":"bool"},{"internalType":"bool","name":"isSold","type":"bool"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"}],"internalType":"struct AgroPredict.CropToken","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"farmer","type":"address"}],"name":"getFarmerTokens","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"cropType","type":"string"}],"name":"getPrediction","outputs":[{"components":[{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"predictedPrice","type":"uint256"},{"internalType":"uint256","name":"confidence","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"targetDate","type":"uint256"}],"internalType":"struct AgroPredict.PricePrediction","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getStats","outputs":[{"internalType":"uint256","name":"totalTokens","type":"uint256"},{"internalType":"uint256","name":"availableTokens","type":"uint256"},{"internalType":"uint256","name":"soldTokens","type":"uint256"},{"internalType":"uint256","name":"totalVolume","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"latestPredictions","outputs":[{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"predictedPrice","type":"uint256"},{"internalType":"uint256","name":"confidence","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"targetDate","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"uint256","name":"pricePerQuintal","type":"uint256"},{"internalType":"uint256","name":"deliveryDate","type":"uint256"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"}],"name":"mintCropToken","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"platformFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"setPlatformFee","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"predictedPrice","type":"uint256"},{"internalType":"uint256","name":"confidence","type":"uint256"},{"internalType":"uint256","name":"targetDate","type":"uint256"}],"name":"updatePricePrediction","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"verifiedFarmers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"farmer","type":"address"}],"name":"verifyFarmer","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"withdrawFees","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

// Debug de configuración
console.log('=== DEBUG WEB3 CONFIG ===');
console.log('CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
console.log('process.env.REACT_APP_CONTRACT_ADDRESS:', process.env.REACT_APP_CONTRACT_ADDRESS);
console.log('ABI functions count:', CONTRACT_ABI.filter(item => item.type === 'function').length);
console.log('========================');

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

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = '';
  }

  // Conectar wallet
  async connectWallet() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask no está instalado');
      }

      // Solicitar acceso a la cuenta
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No se pudo acceder a ninguna cuenta');
      }

      // Configurar provider
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.account = accounts[0];

      console.log('🔗 Wallet conectado:', this.account);

      // Verificar red
      await this.checkNetwork();

      // Configurar contrato
      if (CONTRACT_ADDRESS) {
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          this.signer
        );
        console.log('📄 Contrato inicializado:', CONTRACT_ADDRESS);
      } else {
        console.warn('⚠️ CONTRACT_ADDRESS no definido');
      }

      return {
        account: this.account,
        provider: this.provider,
        contract: this.contract
      };

    } catch (error) {
      console.error('❌ Error conectando wallet:', error);
      throw error;
    }
  }

  // Verificar que estamos en la red correcta
  async checkNetwork() {
    const network = await this.provider.getNetwork();
    const targetChainId = process.env.REACT_APP_CHAIN_ID || '534351'; // Scroll Sepolia por defecto
    
    console.log('🌐 Red actual:', network.chainId, 'Target:', targetChainId);
    
    if (network.chainId.toString() !== targetChainId) {
      console.log('🔄 Cambiando a red correcta...');
      await this.switchNetwork();
    }
  }

  // Cambiar a la red correcta
  async switchNetwork() {
    const targetNetwork = process.env.REACT_APP_NETWORK || 'scrollSepolia';
    const networkConfig = NETWORKS[targetNetwork];

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainId }],
      });
      console.log('✅ Red cambiada exitosamente');
    } catch (switchError) {
      // Si la red no está agregada, la agregamos
      if (switchError.code === 4902) {
        console.log('➕ Agregando red...');
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
        console.log('✅ Red agregada y activada');
      } else {
        throw switchError;
      }
    }
  }

  // Obtener balance del usuario
  async getBalance(address = null) {
    if (!this.provider) return '0';
    
    const targetAddress = address || this.account;
    const balance = await this.provider.getBalance(targetAddress);
    return ethers.utils.formatEther(balance);
  }

  // Verificar si el usuario es agricultor verificado
  async isVerifiedFarmer(address = null) {
    if (!this.contract) {
      console.warn('⚠️ Contrato no conectado para verificar farmer');
      return false;
    }
    
    const targetAddress = address || this.account;
    try {
      const isVerified = await this.contract.verifiedFarmers(targetAddress);
      console.log(`👨‍🌾 Farmer ${targetAddress} verificado:`, isVerified);
      return isVerified;
    } catch (error) {
      console.error('❌ Error verificando farmer:', error);
      return false;
    }
  }

  // ✅ CORREGIDO: Crear token de cosecha con conversión USD→ETH
  async createCropToken(cropData) {
    if (!this.contract) throw new Error('Contrato no conectado');

    const { cropType, quantity, pricePerUnit, deliveryDate, location } = cropData;
    
    console.log('🌾 === CREATE CROP TOKEN (FIXED) ===');
    console.log('🌾 cropData recibida:', cropData);
    console.log('💰 pricePerUnit (USD):', pricePerUnit);
    console.log('💰 pricePerUnit type:', typeof pricePerUnit);
    
    // ✅ VALIDACIÓN: Verificar que tenemos un precio válido
    if (!pricePerUnit || isNaN(parseFloat(pricePerUnit)) || parseFloat(pricePerUnit) <= 0) {
      throw new Error(`Precio inválido: ${pricePerUnit}. Ingresa un precio válido en USD.`);
    }
    
    // ✅ CONVERSIÓN CORRECTA: USD → ETH → Wei
    const ETH_USD_RATE = 2500; // 1 ETH = $2500
    const priceUSD = parseFloat(pricePerUnit);
    const priceETH = priceUSD / ETH_USD_RATE;
    const priceInWei = ethers.utils.parseEther(priceETH.toString());
    
    console.log('🔧 === CONVERSIÓN DE PRECIO ===');
    console.log('🔧 Precio USD ingresado:', priceUSD);
    console.log('🔧 Tasa ETH/USD:', ETH_USD_RATE);
    console.log('🔧 Precio ETH calculado:', priceETH);
    console.log('🔧 Precio Wei para contrato:', priceInWei.toString());
    
    // ✅ VERIFICACIÓN ESPECIAL para debugging
    if (priceUSD === 4) {
      console.log('🎯 CASO ESPECIAL - $4 USD:');
      console.log('  - Debería ser: 0.0016 ETH');
      console.log('  - Calculado: ', priceETH, 'ETH');
      console.log('  - Match:', priceETH === 0.0016 ? '✅' : '❌');
    }
    
    // Convertir fecha a timestamp
    const deliveryTimestamp = Math.floor(new Date(deliveryDate).getTime() / 1000);
    
    console.log('📊 === DATOS FINALES PARA CONTRATO ===');
    console.log('📊 cropType:', cropType);
    console.log('📊 quantity:', quantity);
    console.log('📊 priceInWei:', priceInWei.toString());
    console.log('📊 deliveryTimestamp:', deliveryTimestamp);
    console.log('📊 location:', location);

    // ✅ LLAMAR AL CONTRATO con precio correctamente convertido
    const tx = await this.contract.mintCropToken(
      cropType,
      quantity,
      priceInWei,  // ✅ Precio en Wei (convertido de USD)
      deliveryTimestamp,
      location,
      `QmHash${Date.now()}` // IPFS hash simulado
    );

    console.log('📤 Transacción enviada:', tx.hash);
    const receipt = await tx.wait();
    console.log('✅ Token creado exitosamente, recibo:', receipt);

    return receipt;
  }

  // Comprar token
  async buyToken(tokenId, totalPriceETH) {
    if (!this.contract) throw new Error('Contrato no conectado');

    console.log('💰 Comprando token:', tokenId, 'por', totalPriceETH, 'ETH');

    // Verificar que recibimos un número válido
    if (isNaN(totalPriceETH) || totalPriceETH <= 0) {
      throw new Error(`Precio inválido: ${totalPriceETH} ETH`);
    }

    const priceInWei = ethers.utils.parseEther(totalPriceETH.toString());
    console.log('💰 Precio en wei:', priceInWei.toString());
    
    // Verificar el precio del token en el contrato
    const tokenData = await this.contract.getCropToken(tokenId);
    const expectedPrice = tokenData.quantity.mul(tokenData.pricePerQuintal);
    console.log('📊 Precio esperado por contrato:', ethers.utils.formatEther(expectedPrice), 'ETH');
    console.log('📊 Precio que estamos enviando:', totalPriceETH, 'ETH');
    
    const tx = await this.contract.buyCropToken(tokenId, {
      value: priceInWei
    });

    console.log('📤 Transacción de compra enviada:', tx.hash);
    const receipt = await tx.wait();
    console.log('✅ Compra completada, recibo:', receipt);

    return receipt;
  }

  // Obtener tokens disponibles
  async getAvailableTokens() {
    if (!this.contract) {
      console.warn('⚠️ Contrato no conectado para obtener tokens disponibles');
      return [];
    }

    try {
      const tokenIds = await this.contract.getAvailableTokens();
      console.log('🛒 Token IDs disponibles:', tokenIds.map(id => id.toNumber()));
      
      const tokens = [];

      for (let i = 0; i < tokenIds.length; i++) {
        const tokenData = await this.contract.getCropToken(tokenIds[i]);
        tokens.push(this.formatTokenData(tokenData, tokenIds[i]));
      }

      console.log('📦 Tokens disponibles formateados:', tokens.length);
      return tokens;
    } catch (error) {
      console.error('❌ Error obteniendo tokens disponibles:', error);
      return [];
    }
  }

  // Obtener tokens del usuario
  async getFarmerTokens(address = null) {
    if (!this.contract) {
      console.warn('⚠️ Contrato no conectado para obtener tokens del farmer');
      return [];
    }

    try {
      const targetAddress = address || this.account;
      const tokenIds = await this.contract.getFarmerTokens(targetAddress);
      console.log('🌾 Token IDs del farmer:', tokenIds.map(id => id.toNumber()));
      
      const tokens = [];

      for (let i = 0; i < tokenIds.length; i++) {
        const tokenData = await this.contract.getCropToken(tokenIds[i]);
        tokens.push(this.formatTokenData(tokenData, tokenIds[i]));
      }

      console.log('👨‍🌾 Tokens del farmer formateados:', tokens.length);
      return tokens;
    } catch (error) {
      console.error('❌ Error obteniendo tokens del farmer:', error);
      return [];
    }
  }

  // Obtener predicción de precios
  async getPricePrediction(cropType) {
    if (!this.contract) {
      console.warn('⚠️ Contrato no conectado para obtener predicción');
      return null;
    }

    try {
      const prediction = await this.contract.getPrediction(cropType);
      
      if (prediction.timestamp.toString() === '0') {
        console.log(`📊 No hay predicción para ${cropType}`);
        return null;
      }

      const formattedPrediction = {
        cropType: prediction.cropType,
        predictedPrice: parseFloat(ethers.utils.formatEther(prediction.predictedPrice)),
        confidence: prediction.confidence.toNumber(),
        timestamp: prediction.timestamp.toNumber(),
        targetDate: prediction.targetDate.toNumber()
      };

      console.log(`🔮 Predicción para ${cropType}:`, formattedPrediction);
      return formattedPrediction;
    } catch (error) {
      console.error(`❌ Error obteniendo predicción para ${cropType}:`, error);
      return null;
    }
  }

  // Obtener estadísticas
  async getStats() {
    if (!this.contract) {
      console.warn('⚠️ Contrato no conectado para obtener stats');
      return null;
    }

    try {
      const stats = await this.contract.getStats();
      
      const formattedStats = {
        totalTokens: stats.totalTokens.toNumber(),
        availableTokens: stats.availableTokens.toNumber(),
        soldTokens: stats.soldTokens.toNumber(),
        totalVolume: parseFloat(ethers.utils.formatEther(stats.totalVolume))
      };

      console.log('📊 Estadísticas del contrato:', formattedStats);
      return formattedStats;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return {
        totalTokens: 0,
        availableTokens: 0,
        soldTokens: 0,
        totalVolume: 0
      };
    }
  }

  // Formatear datos del token
  formatTokenData(tokenData, tokenId) {
    const formatted = {
      id: tokenId.toNumber(),
      farmer: tokenData.farmer,
      cropType: tokenData.cropType,
      quantity: tokenData.quantity.toNumber(),
      pricePerQuintal: parseFloat(ethers.utils.formatEther(tokenData.pricePerQuintal)),
      totalPrice: tokenData.quantity.toNumber() * parseFloat(ethers.utils.formatEther(tokenData.pricePerQuintal)),
      deliveryDate: new Date(tokenData.deliveryDate.toNumber() * 1000).toLocaleDateString(),
      deliveryTimestamp: tokenData.deliveryDate.toNumber(),
      location: tokenData.location,
      ipfsHash: tokenData.ipfsHash,
      isDelivered: tokenData.isDelivered,
      isSold: tokenData.isSold,
      buyer: tokenData.buyer,
      createdAt: new Date(tokenData.createdAt.toNumber() * 1000).toLocaleDateString(),
      createdTimestamp: tokenData.createdAt.toNumber()
    };

    console.log(`📝 Token ${tokenId.toNumber()} formateado:`, formatted);
    return formatted;
  }

  // Escuchar eventos
  subscribeToEvents(callback) {
    if (!this.contract) {
      console.warn('⚠️ Contrato no conectado para eventos');
      return;
    }

    console.log('👂 Suscribiéndose a eventos del contrato...');

    // Escuchar tokens creados
    this.contract.on('CropTokenMinted', (tokenId, farmer, cropType, quantity, price) => {
      console.log('🎉 Evento TokenMinted:', {
        tokenId: tokenId.toNumber(),
        farmer,
        cropType,
        quantity: quantity.toNumber(),
        price: parseFloat(ethers.utils.formatEther(price))
      });
      
      callback('TokenMinted', {
        tokenId: tokenId.toNumber(),
        farmer,
        cropType,
        quantity: quantity.toNumber(),
        price: parseFloat(ethers.utils.formatEther(price))
      });
    });

    // Escuchar ventas
    this.contract.on('CropTokenSold', (tokenId, buyer, totalPrice) => {
      console.log('💰 Evento TokenSold:', {
        tokenId: tokenId.toNumber(),
        buyer,
        totalPrice: parseFloat(ethers.utils.formatEther(totalPrice))
      });
      
      callback('TokenSold', {
        tokenId: tokenId.toNumber(),
        buyer,
        totalPrice: parseFloat(ethers.utils.formatEther(totalPrice))
      });
    });
  }

  // Desconectar
  disconnect() {
    console.log('🔌 Desconectando web3Service...');
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = '';
  }
}

// Singleton
export const web3Service = new Web3Service();

// Hook personalizado para React
export const useWeb3 = () => {
  return web3Service;
};