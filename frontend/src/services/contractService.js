// services/contractService.js - Servicio para interactuar con el smart contract
import { ethers } from 'ethers';
import { CONFIG } from '../config';
import { AGROPREDICT_ABI } from '../contracts/abi';
import { walletService } from './walletService';
import { 
  formatTokenData, 
  formatStats, 
  convertUSDtoETH, 
  convertETHtoWei,
  convertWeiToETH,
  parseWeb3Error,
  generateIPFSHash 
} from '../utils/helpers';

class ContractService {
  constructor() {
    this.contract = null;
    this.eventListeners = [];
    
    console.log('📜 ContractService initialized');
  }

  // =================== INICIALIZACIÓN ===================

  /**
   * Inicializa el contrato con el wallet conectado
   * @returns {Promise<boolean>} True si se inicializó correctamente
   */
  async initialize() {
    try {
      console.log('🔗 === INITIALIZING CONTRACT ===');
      
      if (!CONFIG.CONTRACT_ADDRESS) {
        throw new Error('Dirección del contrato no configurada');
      }
      
      if (!walletService.getIsConnected()) {
        throw new Error('Wallet no conectado');
      }
      
      const signer = walletService.getSigner();
      if (!signer) {
        throw new Error('Signer no disponible');
      }
      
      // Crear instancia del contrato
      this.contract = new ethers.Contract(
        CONFIG.CONTRACT_ADDRESS,
        AGROPREDICT_ABI,
        signer
      );
      
      console.log('📜 Contract instance created:', CONFIG.CONTRACT_ADDRESS);
      
      // Verificar que el contrato existe en la blockchain
      const provider = walletService.getProvider();
      const code = await provider.getCode(CONFIG.CONTRACT_ADDRESS);
      
      if (code === '0x') {
        throw new Error(`No hay contrato desplegado en ${CONFIG.CONTRACT_ADDRESS}`);
      }
      
      console.log('✅ Contract verified on blockchain');
      
      // Configurar listeners de eventos
      this.setupEventListeners();
      
      return true;
      
    } catch (error) {
      console.error('❌ Error initializing contract:', error);
      this.contract = null;
      throw new Error('Error conectando al contrato: ' + error.message);
    }
  }

  /**
   * Verifica si el contrato está inicializado
   * @returns {boolean} Estado de inicialización
   */
  isInitialized() {
    return this.contract !== null;
  }

  /**
   * Fuerza la reconexión del contrato
   */
  async reconnect() {
    this.contract = null;
    await this.initialize();
  }

  // =================== FUNCIONES DE LECTURA ===================

  /**
   * Obtiene todos los tokens disponibles en el marketplace
   * @returns {Promise<Array>} Array de tokens disponibles
   */
  async getAvailableTokens() {
    try {
      console.log('🛒 Getting available marketplace tokens...');
      
      if (!this.contract) await this.initialize();
      
      const tokenIds = await this.contract.getAvailableTokens();
      console.log('🔢 Available token IDs:', tokenIds.map(id => id.toString()));
      
      const tokens = [];
      for (const tokenId of tokenIds) {
        try {
          const tokenData = await this.contract.getCropToken(tokenId);
          const formattedToken = formatTokenData(tokenData, tokenId);
          tokens.push(formattedToken);
        } catch (tokenError) {
          console.error(`❌ Error getting token ${tokenId}:`, tokenError);
        }
      }
      
      console.log('✅ Formatted available tokens:', tokens.length);
      return tokens;
      
    } catch (error) {
      console.error('❌ Error getting available tokens:', error);
      throw new Error('Error obteniendo tokens disponibles: ' + parseWeb3Error(error));
    }
  }

  /**
   * Obtiene los tokens de un agricultor específico
   * @param {string} farmerAddress - Dirección del agricultor (opcional)
   * @returns {Promise<Array>} Array de tokens del agricultor
   */
  async getFarmerTokens(farmerAddress = null) {
    try {
      const targetAddress = farmerAddress || walletService.getAccount();
      console.log('🌾 Getting farmer tokens for:', targetAddress);
      
      if (!this.contract) await this.initialize();
      
      const tokenIds = await this.contract.getFarmerTokens(targetAddress);
      console.log('🔢 Farmer token IDs:', tokenIds.map(id => id.toString()));
      
      const tokens = [];
      for (const tokenId of tokenIds) {
        try {
          const tokenData = await this.contract.getCropToken(tokenId);
          const formattedToken = formatTokenData(tokenData, tokenId);
          tokens.push(formattedToken);
        } catch (tokenError) {
          console.error(`❌ Error getting farmer token ${tokenId}:`, tokenError);
        }
      }
      
      console.log('✅ Formatted farmer tokens:', tokens.length);
      return tokens;
      
    } catch (error) {
      console.error('❌ Error getting farmer tokens:', error);
      throw new Error('Error obteniendo tokens del agricultor: ' + parseWeb3Error(error));
    }
  }

  /**
   * Obtiene los detalles de un token específico
   * @param {number|string} tokenId - ID del token
   * @returns {Promise<Object>} Datos del token formateados
   */
  async getTokenDetails(tokenId) {
    try {
      console.log('📋 Getting token details for ID:', tokenId);
      
      if (!this.contract) await this.initialize();
      
      const tokenData = await this.contract.getCropToken(tokenId);
      const formattedToken = formatTokenData(tokenData, ethers.BigNumber.from(tokenId));
      
      console.log('✅ Token details retrieved:', formattedToken);
      return formattedToken;
      
    } catch (error) {
      console.error('❌ Error getting token details:', error);
      throw new Error('Error obteniendo detalles del token: ' + parseWeb3Error(error));
    }
  }

  /**
   * Obtiene las estadísticas del contrato
   * @returns {Promise<Object>} Estadísticas formateadas
   */
  async getStats() {
    try {
      console.log('📊 Getting contract stats...');
      
      if (!this.contract) await this.initialize();
      
      const stats = await this.contract.getStats();
      const formattedStats = formatStats(stats);
      
      console.log('✅ Contract stats:', formattedStats);
      return formattedStats;
      
    } catch (error) {
      console.error('❌ Error getting stats:', error);
      // Devolver stats por defecto en caso de error
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
  }

  /**
   * Obtiene predicción de precios para un cultivo
   * @param {string} cropType - Tipo de cultivo
   * @returns {Promise<Object|null>} Predicción formateada o null
   */
  async getPricePrediction(cropType) {
    try {
      console.log('🔮 Getting price prediction for:', cropType);
      
      if (!this.contract) await this.initialize();
      
      const prediction = await this.contract.getPrediction(cropType);
      
      if (prediction.timestamp.toString() === '0') {
        console.log(`📊 No prediction found for ${cropType}`);
        return null;
      }

      const formattedPrediction = {
        cropType: prediction.cropType,
        predictedPriceETH: convertWeiToETH(prediction.predictedPrice),
        predictedPriceUSD: convertWeiToETH(prediction.predictedPrice) * CONFIG.ETH_USD_RATE,
        confidence: prediction.confidence.toNumber(),
        timestamp: prediction.timestamp.toNumber(),
        targetDate: prediction.targetDate.toNumber(),
        
        // Datos calculados
        createdAt: new Date(prediction.timestamp.toNumber() * 1000),
        targetDateFormatted: new Date(prediction.targetDate.toNumber() * 1000),
        confidenceLevel: prediction.confidence.toNumber() >= 80 ? 'Alto' : 
                        prediction.confidence.toNumber() >= 60 ? 'Medio' : 'Bajo'
      };

      console.log('✅ Price prediction:', formattedPrediction);
      return formattedPrediction;
      
    } catch (error) {
      console.error('❌ Error getting price prediction:', error);
      return null;
    }
  }

  /**
   * Verifica si un agricultor está verificado
   * @param {string} farmerAddress - Dirección del agricultor (opcional)
   * @returns {Promise<boolean>} Estado de verificación
   */
  async isVerifiedFarmer(farmerAddress = null) {
    try {
      const targetAddress = farmerAddress || walletService.getAccount();
      
      if (!this.contract) await this.initialize();
      
      const isVerified = await this.contract.verifiedFarmers(targetAddress);
      console.log(`👨‍🌾 Farmer ${targetAddress} verified:`, isVerified);
      
      return isVerified;
      
    } catch (error) {
      console.error('❌ Error checking farmer verification:', error);
      return false;
    }
  }

  // =================== FUNCIONES DE ESCRITURA ===================

  /**
   * Crea un nuevo token de cosecha - VERSIÓN CORREGIDA
   * @param {Object} tokenData - Datos del token
   * @returns {Promise<Object>} Resultado de la transacción
   */
  async createCropToken(tokenData) {
    try {
      console.log('🌾 === CREATING CROP TOKEN (GENERAL SOLUTION) ===');
      console.log('🌾 tokenData:', tokenData);
      
      if (!this.contract) await this.initialize();
      
      const { cropType, quantity, pricePerUnit, deliveryDate, location } = tokenData;
      
      // Validaciones
      if (!cropType || !quantity || !pricePerUnit || !deliveryDate || !location) {
        throw new Error('Todos los campos son requeridos');
      }
      
      console.log('💰 === GENERAL PRICE CONVERSION ===');
      console.log('💰 Original pricePerUnit (USD):', pricePerUnit);
      
      const priceUSD = parseFloat(pricePerUnit);
      if (isNaN(priceUSD) || priceUSD <= 0) {
        throw new Error(`Precio inválido: ${pricePerUnit}`);
      }
      
      // ✅ SOLUCIÓN GENERAL: Aritmética de enteros para cualquier precio
      const priceInWei = this.convertUSDtoWeiSafe(priceUSD);
      
      console.log('💰 Final price in Wei:', priceInWei.toString());
      console.log('💰 Back to ETH for verification:', ethers.utils.formatEther(priceInWei));
      console.log('💰 Back to USD for verification:', parseFloat(ethers.utils.formatEther(priceInWei)) * 2500);
      
      // Verificaciones de seguridad
      if (priceInWei.isZero()) {
        throw new Error('El precio convertido a Wei es cero');
      }
      
      if (priceInWei.lt(ethers.BigNumber.from('100000000000000'))) { // Mínimo 0.0001 ETH
        throw new Error('El precio es demasiado pequeño para el contrato');
      }
      
      // Convertir fecha a timestamp Unix
      const deliveryTimestamp = Math.floor(new Date(deliveryDate).getTime() / 1000);
      
      if (deliveryTimestamp <= Math.floor(Date.now() / 1000)) {
        throw new Error('La fecha de entrega debe ser futura');
      }
      
      // Generar hash IPFS simulado
      const ipfsHash = generateIPFSHash();
      
      // Preparar parámetros para el contrato
      const contractParams = [
        cropType,
        parseInt(quantity),
        priceInWei,
        deliveryTimestamp,
        location,
        ipfsHash
      ];
      
      console.log('📝 === CONTRACT PARAMETERS ===');
      contractParams.forEach((param, index) => {
        console.log(`📝 Param ${index}:`, typeof param === 'object' ? param.toString() : param);
      });
      
      // Estimar gas
      console.log('⛽ Estimating gas...');
      const gasEstimate = await this.contract.estimateGas.mintCropToken(...contractParams);
      const gasLimit = gasEstimate.mul(120).div(100);
      
      console.log('⛽ Gas estimate:', gasEstimate.toString());
      
      // Enviar transacción
      console.log('🚀 Sending transaction...');
      const tx = await this.contract.mintCropToken(...contractParams, {
        gasLimit: gasLimit
      });
      
      console.log('📤 Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      
      console.log('✅ Token created successfully!');
      
      // Extraer evento
      const mintEvent = receipt.events?.find(e => e.event === 'CropTokenMinted');
      let tokenId = null;
      
      if (mintEvent) {
        tokenId = mintEvent.args.tokenId.toString();
        console.log('🎯 New token ID:', tokenId);
      }
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        tokenId: tokenId,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
      
    } catch (error) {
      console.error('❌ Error creating crop token:', error);
      throw new Error(`Error creando token: ${error.message}`);
    }
  }

  /**
   * Conversión segura USD → Wei usando aritmética de enteros
   * @param {number} priceUSD - Precio en USD
   * @returns {ethers.BigNumber} Precio en Wei
   */
  convertUSDtoWeiSafe(priceUSD) {
    console.log('🔧 === SAFE USD TO WEI CONVERSION ===');
    console.log('🔧 Input USD:', priceUSD);
    
    // Convertir a centavos para trabajar con enteros
    const priceCents = Math.round(priceUSD * 100);
    console.log('🔧 Price in cents:', priceCents);
    
    // Verificar que no perdimos precisión
    const backToUSD = priceCents / 100;
    console.log('🔧 Back to USD check:', backToUSD);
    
    if (Math.abs(backToUSD - priceUSD) > 0.01) {
      throw new Error(`Precio con demasiados decimales: ${priceUSD}. Usa máximo 2 decimales.`);
    }
    
    // Calcular Wei usando aritmética de enteros
    // $1 = 0.0004 ETH = 400000000000000 Wei
    // Entonces: $0.01 = 4000000000000 Wei
    const weiPerCent = ethers.BigNumber.from('4000000000000'); // Wei por centavo
    const priceInWei = weiPerCent.mul(priceCents);
    
    console.log('🔧 Wei per cent:', weiPerCent.toString());
    console.log('🔧 Final Wei amount:', priceInWei.toString());
    
    // Verificación: convertir de vuelta para asegurar que está correcto
    const backToETH = ethers.utils.formatEther(priceInWei);
    const backToUSDVerification = parseFloat(backToETH) * 2500;
    
    console.log('🔧 Verification - back to ETH:', backToETH);
    console.log('🔧 Verification - back to USD:', backToUSDVerification);
    
    // Permitir pequeña diferencia debido a precisión limitada de Wei
    if (Math.abs(backToUSDVerification - priceUSD) > 0.02) {
      console.warn('⚠️ Precision loss detected but within acceptable range');
    }
    
    return priceInWei;
  }

  /**
   * Compra un token del marketplace - VERSIÓN CORREGIDA
   * @param {number|string} tokenId - ID del token a comprar
   * @param {number|string} totalPriceETH - Precio total en ETH (opcional, se calculará desde el contrato)
   * @returns {Promise<Object>} Resultado de la transacción
   */
  async buyToken(tokenId, totalPriceETH = null) {
    try {
      console.log('💰 === BUYING TOKEN (FIXED) ===');
      console.log('💰 Token ID:', tokenId);
      console.log('💰 Price from frontend:', totalPriceETH);
      
      if (!this.contract) await this.initialize();
      
      // Obtener datos actuales del token del contrato
      console.log('🔍 Getting current token data from contract...');
      const tokenData = await this.contract.getCropToken(tokenId);
      
      // Verificar condiciones del token
      if (tokenData.isSold) {
        throw new Error('El token ya fue vendido');
      }
      
      const now = Math.floor(Date.now() / 1000);
      if (tokenData.deliveryDate.toNumber() <= now) {
        throw new Error('La fecha de entrega del token ya pasó');
      }
      
      // Calcular precio correcto del contrato
      const contractTotalPriceWei = tokenData.quantity.mul(tokenData.pricePerQuintal);
      const contractTotalPriceETH = convertWeiToETH(contractTotalPriceWei);
      
      console.log('💰 Price verification:');
      console.log('  - Contract total (Wei):', contractTotalPriceWei.toString());
      console.log('  - Contract total (ETH):', contractTotalPriceETH);
      console.log('  - Frontend price (ETH):', totalPriceETH);
      
      // Usar el precio del contrato como fuente de verdad
      const finalPriceWei = contractTotalPriceWei;
      const finalPriceETH = contractTotalPriceETH;
      
      console.log('✅ Using contract price:', finalPriceETH, 'ETH');
      
      // Verificar balance suficiente
      const hasEnough = await walletService.hasEnoughBalance(finalPriceETH, true);
      if (!hasEnough) {
        const balance = await walletService.getBalance();
        throw new Error(`Balance insuficiente. Tienes ${balance} ETH, necesitas aproximadamente ${(finalPriceETH + 0.001).toFixed(4)} ETH`);
      }
      
      // Estimar gas antes de la transacción
      console.log('⛽ Estimating gas...');
      let gasEstimate;
      try {
        gasEstimate = await this.contract.estimateGas.buyCropToken(tokenId, {
          value: finalPriceWei
        });
        console.log('⛽ Gas estimate successful:', gasEstimate.toString());
      } catch (gasError) {
        console.error('❌ Gas estimation failed:', gasError);
        throw new Error(parseWeb3Error(gasError));
      }
      
      // Calcular costos totales
      const gasPrice = await walletService.getProvider().getGasPrice();
      const gasCost = gasEstimate.mul(gasPrice);
      const totalCost = finalPriceWei.add(gasCost);
      
      console.log('💸 Cost breakdown:');
      console.log('  - Token price:', convertWeiToETH(finalPriceWei), 'ETH');
      console.log('  - Gas cost:', convertWeiToETH(gasCost), 'ETH');
      console.log('  - Total cost:', convertWeiToETH(totalCost), 'ETH');
      
      // Verificar balance total
      const balanceWei = await walletService.getBalanceWei();
      if (balanceWei.lt(totalCost)) {
        const balanceETH = convertWeiToETH(balanceWei);
        const totalCostETH = convertWeiToETH(totalCost);
        throw new Error(`Balance insuficiente incluyendo gas. Tienes ${balanceETH} ETH, necesitas ${totalCostETH} ETH`);
      }
      
      // Ejecutar transacción de compra
      console.log('🚀 Sending purchase transaction...');
      const tx = await this.contract.buyCropToken(tokenId, {
        value: finalPriceWei,
        gasLimit: gasEstimate.mul(110).div(100), // 10% extra gas
        gasPrice: gasPrice
      });
      
      console.log('📤 Transaction sent:', tx.hash);
      console.log('⏳ Waiting for confirmation...');
      
      // Esperar confirmación con timeout
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout en la compra del token')), CONFIG.TRANSACTION_TIMEOUT)
        )
      ]);
      
      console.log('🎉 PURCHASE SUCCESSFUL!');
      console.log('✅ Receipt:', receipt);
      
      // Verificar evento de venta
      const saleEvent = receipt.events?.find(e => e.event === 'CropTokenSold');
      let saleData = null;
      
      if (saleEvent) {
        saleData = {
          tokenId: saleEvent.args.tokenId.toString(),
          buyer: saleEvent.args.buyer,
          totalPrice: convertWeiToETH(saleEvent.args.totalPrice)
        };
        console.log('🎊 Sale event:', saleData);
      }
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        saleData: saleData
      };
      
    } catch (error) {
      console.error('❌ Error buying token:', error);
      throw new Error('Error comprando token: ' + parseWeb3Error(error));
    }
  }

  /**
   * Confirma la entrega de un token
   * @param {number|string} tokenId - ID del token
   * @returns {Promise<Object>} Resultado de la transacción
   */
  async confirmDelivery(tokenId) {
    try {
      console.log('📦 Confirming delivery for token:', tokenId);
      
      if (!this.contract) await this.initialize();
      
      const tx = await this.contract.confirmDelivery(tokenId);
      console.log('📤 Delivery confirmation sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('✅ Delivery confirmed:', receipt);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
      
    } catch (error) {
      console.error('❌ Error confirming delivery:', error);
      throw new Error('Error confirmando entrega: ' + parseWeb3Error(error));
    }
  }

  // =================== EVENTOS ===================

  /**
   * Configura los listeners para eventos del contrato
   */
  setupEventListeners() {
    if (!this.contract) return;
    
    console.log('👂 Setting up contract event listeners...');
    
    // Evento de token creado
    this.contract.on('CropTokenMinted', (tokenId, farmer, cropType, quantity, pricePerQuintal) => {
      const eventData = {
        tokenId: tokenId.toString(),
        farmer,
        cropType,
        quantity: quantity.toString(),
        pricePerQuintal: convertWeiToETH(pricePerQuintal)
      };
      
      console.log('🎉 CropTokenMinted event:', eventData);
      this.notifyEventListeners('TokenMinted', eventData);
    });
    
    // Evento de token vendido
    this.contract.on('CropTokenSold', (tokenId, buyer, totalPrice) => {
      const eventData = {
        tokenId: tokenId.toString(),
        buyer,
        totalPrice: convertWeiToETH(totalPrice)
      };
      
      console.log('💰 CropTokenSold event:', eventData);
      this.notifyEventListeners('TokenSold', eventData);
    });
    
    // Evento de entrega confirmada
    this.contract.on('CropDelivered', (tokenId, farmer, buyer) => {
      const eventData = {
        tokenId: tokenId.toString(),
        farmer,
        buyer
      };
      
      console.log('📦 CropDelivered event:', eventData);
      this.notifyEventListeners('TokenDelivered', eventData);
    });
    
    console.log('✅ Event listeners configured');
  }

  /**
   * Agrega un listener para eventos del contrato
   * @param {Function} callback - Función callback
   */
  addEventListener(callback) {
    this.eventListeners.push(callback);
  }

  /**
   * Remueve un listener de eventos
   * @param {Function} callback - Función callback a remover
   */
  removeEventListener(callback) {
    const index = this.eventListeners.indexOf(callback);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * Notifica a todos los listeners sobre un evento
   * @param {string} eventType - Tipo de evento
   * @param {Object} eventData - Datos del evento
   */
  notifyEventListeners(eventType, eventData) {
    this.eventListeners.forEach(callback => {
      try {
        callback(eventType, eventData);
      } catch (error) {
        console.error('Error in event listener callback:', error);
      }
    });
  }

  /**
   * Limpia todos los listeners de eventos
   */
  removeAllEventListeners() {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
    this.eventListeners = [];
    console.log('🔇 All event listeners removed');
  }

  // =================== UTILIDADES ===================

  /**
   * Obtiene la dirección del contrato
   * @returns {string} Dirección del contrato
   */
  getContractAddress() {
    return CONFIG.CONTRACT_ADDRESS;
  }

  /**
   * Obtiene la instancia del contrato
   * @returns {ethers.Contract|null} Instancia del contrato
   */
  getContract() {
    return this.contract;
  }

  /**
   * Desconecta y limpia el servicio
   */
  disconnect() {
    console.log('🔌 Disconnecting contract service...');
    this.removeAllEventListeners();
    this.contract = null;
    console.log('✅ Contract service disconnected');
  }
}

// Singleton instance
export const contractService = new ContractService();

// Export también la clase para testing
export { ContractService };

console.log('📜 ContractService module loaded');