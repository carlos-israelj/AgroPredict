// utils/web3.js - Servicio Web3 Principal (Refactorizado)
import { validateConfig } from '../config';
import { walletService } from '../services/walletService';
import { contractService } from '../services/contractService';
import { parseWeb3Error } from './helpers';

// Validar configuración al importar
try {
  validateConfig();
} catch (error) {
  console.error('❌ Error de configuración:', error);
}

/**
 * Servicio Web3 principal que coordina wallet y contrato
 */
class Web3Service {
  constructor() {
    this.isInitialized = false;
    this.eventCallbacks = [];
    
    console.log('🌐 Web3Service initialized');
  }

  // =================== INICIALIZACIÓN ===================

  /**
   * Conecta la wallet y inicializa el contrato
   * @returns {Promise<Object>} Resultado de la conexión
   */
  async connectWallet() {
    try {
      console.log('🔗 === WEB3SERVICE CONNECT WALLET ===');
      
      // Conectar wallet
      const walletResult = await walletService.connect();
      
      if (!walletResult.success) {
        throw new Error(walletResult.message || 'Error conectando wallet');
      }
      
      // Inicializar contrato
      await contractService.initialize();
      
      // Configurar listeners
      this.setupEventForwarding();
      
      this.isInitialized = true;
      
      return {
        success: true,
        account: walletResult.account,
        chainId: walletResult.chainId,
        message: 'Wallet y contrato conectados exitosamente'
      };
      
    } catch (error) {
      console.error('❌ Error in connectWallet:', error);
      throw new Error(parseWeb3Error(error));
    }
  }

  /**
   * Verifica conexión previa y reconecta si es necesario
   * @returns {Promise<boolean>} True si hay conexión
   */
  async checkConnection() {
    try {
      const hasConnection = await walletService.checkPreviousConnection();
      
      if (hasConnection && !contractService.isInitialized()) {
        await contractService.initialize();
        this.setupEventForwarding();
        this.isInitialized = true;
      }
      
      return hasConnection;
      
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  }

  /**
   * Desconecta wallet y contrato
   */
  disconnect() {
    console.log('🔌 Disconnecting Web3Service...');
    
    contractService.disconnect();
    walletService.disconnect();
    this.isInitialized = false;
    this.eventCallbacks = [];
    
    console.log('✅ Web3Service disconnected');
  }

  // =================== PROPIEDADES DE ACCESO ===================

  /**
   * Obtiene la cuenta conectada
   * @returns {string} Dirección de la cuenta
   */
  get account() {
    return walletService.getAccount();
  }

  /**
   * Obtiene el provider
   * @returns {ethers.providers.Web3Provider|null} Provider
   */
  get provider() {
    return walletService.getProvider();
  }

  /**
   * Obtiene el contrato
   * @returns {ethers.Contract|null} Instancia del contrato
   */
  get contract() {
    return contractService.getContract();
  }

  /**
   * Verifica si está conectado
   * @returns {boolean} Estado de conexión
   */
  get isConnected() {
    return walletService.getIsConnected() && contractService.isInitialized();
  }

  // =================== FUNCIONES DE WALLET ===================

  /**
   * Obtiene el balance de ETH
   * @param {string} address - Dirección (opcional)
   * @returns {Promise<string>} Balance en ETH
   */
  async getBalance(address = null) {
    return await walletService.getBalance(address);
  }

  /**
   * Verifica si hay balance suficiente
   * @param {string|number} amountETH - Cantidad requerida
   * @returns {Promise<boolean>} True si hay balance suficiente
   */
  async hasEnoughBalance(amountETH) {
    return await walletService.hasEnoughBalance(amountETH);
  }

  /**
   * Obtiene información de la red
   * @returns {Promise<Object>} Información de la red
   */
  async getNetworkInfo() {
    return await walletService.getNetworkInfo();
  }

  /**
   * Formatea la dirección actual
   * @returns {string} Dirección formateada
   */
  formatAddress() {
    return walletService.formatAddress();
  }

  // =================== FUNCIONES DEL CONTRATO ===================

  /**
   * Obtiene tokens disponibles en el marketplace
   * @returns {Promise<Array>} Array de tokens
   */
  async getAvailableTokens() {
    try {
      if (!this.isConnected) {
        await this.connectWallet();
      }
      
      return await contractService.getAvailableTokens();
    } catch (error) {
      console.error('Error getting available tokens:', error);
      throw new Error(parseWeb3Error(error));
    }
  }

  /**
   * Obtiene tokens de un agricultor
   * @param {string} farmerAddress - Dirección del agricultor (opcional)
   * @returns {Promise<Array>} Array de tokens
   */
  async getFarmerTokens(farmerAddress = null) {
    try {
      if (!this.isConnected) {
        await this.connectWallet();
      }
      
      return await contractService.getFarmerTokens(farmerAddress);
    } catch (error) {
      console.error('Error getting farmer tokens:', error);
      throw new Error(parseWeb3Error(error));
    }
  }

  /**
   * Obtiene detalles de un token
   * @param {number|string} tokenId - ID del token
   * @returns {Promise<Object>} Detalles del token
   */
  async getCropToken(tokenId) {
    try {
      if (!this.isConnected) {
        await this.connectWallet();
      }
      
      return await contractService.getTokenDetails(tokenId);
    } catch (error) {
      console.error('Error getting crop token:', error);
      throw new Error(parseWeb3Error(error));
    }
  }

  /**
   * Obtiene estadísticas del contrato
   * @returns {Promise<Object>} Estadísticas
   */
  async getStats() {
    try {
      if (!this.isConnected) {
        await this.connectWallet();
      }
      
      return await contractService.getStats();
    } catch (error) {
      console.error('Error getting stats:', error);
      throw new Error(parseWeb3Error(error));
    }
  }

  /**
   * Obtiene predicción de precios
   * @param {string} cropType - Tipo de cultivo
   * @returns {Promise<Object|null>} Predicción
   */
  async getPrediction(cropType) {
    try {
      if (!this.isConnected) {
        await this.connectWallet();
      }
      
      return await contractService.getPricePrediction(cropType);
    } catch (error) {
      console.error('Error getting prediction:', error);
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
      if (!this.isConnected) {
        await this.connectWallet();
      }
      
      return await contractService.isVerifiedFarmer(farmerAddress);
    } catch (error) {
      console.error('Error checking farmer verification:', error);
      return false;
    }
  }

  // =================== TRANSACCIONES ===================

  /**
   * Crea un token de cosecha
   * @param {Object} tokenData - Datos del token
   * @returns {Promise<Object>} Resultado de la transacción
   */
  async createCropToken(tokenData) {
    try {
      console.log('🌾 Web3Service: Creating crop token...');
      
      if (!this.isConnected) {
        await this.connectWallet();
      }
      
      const result = await contractService.createCropToken(tokenData);
      
      console.log('✅ Token created successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error creating crop token:', error);
      throw new Error(parseWeb3Error(error));
    }
  }

  /**
   * Compra un token del marketplace
   * @param {number|string} tokenId - ID del token
   * @param {number|string} totalPriceETH - Precio total en ETH
   * @returns {Promise<Object>} Resultado de la transacción
   */
  async buyToken(tokenId, totalPriceETH) {
    try {
      console.log('💰 Web3Service: Buying token...', { tokenId, totalPriceETH });
      
      if (!this.isConnected) {
        await this.connectWallet();
      }
      
      const result = await contractService.buyToken(tokenId, totalPriceETH);
      
      console.log('✅ Token purchased successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error buying token:', error);
      throw new Error(parseWeb3Error(error));
    }
  }

  /**
   * Confirma la entrega de un token
   * @param {number|string} tokenId - ID del token
   * @returns {Promise<Object>} Resultado de la transacción
   */
  async confirmDelivery(tokenId) {
    try {
      console.log('📦 Web3Service: Confirming delivery...', tokenId);
      
      if (!this.isConnected) {
        await this.connectWallet();
      }
      
      const result = await contractService.confirmDelivery(tokenId);
      
      console.log('✅ Delivery confirmed successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error confirming delivery:', error);
      throw new Error(parseWeb3Error(error));
    }
  }

  // =================== EVENTOS ===================

  /**
   * Configura el reenvío de eventos del contrato
   */
  setupEventForwarding() {
    // Agregar listener al contrato para reenviar eventos
    contractService.addEventListener((eventType, eventData) => {
      this.notifyEventCallbacks(eventType, eventData);
    });
    
    console.log('📡 Event forwarding configured');
  }

  /**
   * Suscribe a eventos del contrato
   * @param {Function} callback - Función callback
   */
  subscribeToEvents(callback) {
    this.eventCallbacks.push(callback);
    console.log('👂 Event callback registered');
  }

  /**
   * Desuscribe de eventos del contrato
   * @param {Function} callback - Función callback a remover
   */
  unsubscribeFromEvents(callback) {
    const index = this.eventCallbacks.indexOf(callback);
    if (index > -1) {
      this.eventCallbacks.splice(index, 1);
      console.log('🔇 Event callback removed');
    }
  }

  /**
   * Notifica a todos los callbacks sobre un evento
   * @param {string} eventType - Tipo de evento
   * @param {Object} eventData - Datos del evento
   */
  notifyEventCallbacks(eventType, eventData) {
    this.eventCallbacks.forEach(callback => {
      try {
        callback(eventType, eventData);
      } catch (error) {
        console.error('Error in event callback:', error);
      }
    });
  }

  // =================== UTILIDADES ===================

  /**
   * Obtiene URL del explorador para una transacción
   * @param {string} txHash - Hash de la transacción
   * @returns {string} URL del explorador
   */
  getTxExplorerUrl(txHash) {
    return walletService.getTxExplorerUrl(txHash);
  }

  /**
   * Obtiene URL del explorador para una dirección
   * @param {string} address - Dirección
   * @returns {string} URL del explorador
   */
  getAddressExplorerUrl(address = null) {
    return walletService.getAddressExplorerUrl(address);
  }

  /**
   * Fuerza la reconexión de todos los servicios
   */
  async forceReconnect() {
    console.log('🔄 Forcing reconnection...');
    
    this.disconnect();
    await this.connectWallet();
    
    console.log('✅ Reconnection completed');
  }

  /**
   * Obtiene el estado completo del servicio
   * @returns {Object} Estado del servicio
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isConnected: this.isConnected,
      account: this.account,
      walletConnected: walletService.getIsConnected(),
      contractInitialized: contractService.isInitialized(),
      contractAddress: contractService.getContractAddress(),
      eventListeners: this.eventCallbacks.length
    };
  }

  // =================== MÉTODOS DE COMPATIBILIDAD ===================
  // Estos métodos mantienen compatibilidad con el código existente

  /**
   * @deprecated Usar getAvailableTokens()
   */
  async getMarketplaceTokens() {
    console.warn('⚠️ getMarketplaceTokens() is deprecated, use getAvailableTokens()');
    return this.getAvailableTokens();
  }

  /**
   * @deprecated Usar createCropToken()
   */
  async mintCropToken(tokenData) {
    console.warn('⚠️ mintCropToken() is deprecated, use createCropToken()');
    return this.createCropToken(tokenData);
  }

  /**
   * @deprecated Usar buyToken()
   */
  async buyCropToken(tokenId, totalPriceETH) {
    console.warn('⚠️ buyCropToken() is deprecated, use buyToken()');
    return this.buyToken(tokenId, totalPriceETH);
  }
}

// =================== INSTANCIA SINGLETON ===================

// Crear instancia singleton
export const web3Service = new Web3Service();

// =================== HOOKS Y UTILIDADES ===================

/**
 * Hook personalizado para React
 * @returns {Web3Service} Instancia del servicio
 */
export const useWeb3 = () => {
  return web3Service;
};

/**
 * Función helper para verificar si Web3 está disponible
 * @returns {boolean} True si MetaMask está disponible
 */
export const isWeb3Available = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Función helper para obtener la versión de MetaMask
 * @returns {string|null} Versión de MetaMask o null
 */
export const getMetaMaskVersion = () => {
  if (typeof window !== 'undefined' && window.ethereum?.isMetaMask) {
    return window.ethereum.version || 'desconocida';
  }
  return null;
};

// =================== CONFIGURACIÓN INICIAL ===================

// Auto-inicialización si hay conexión previa
if (typeof window !== 'undefined') {
  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      web3Service.checkConnection().catch(console.error);
    });
  } else {
    // DOM ya está listo
    setTimeout(() => {
      web3Service.checkConnection().catch(console.error);
    }, 100);
  }
}

// =================== EXPORTACIONES ADICIONALES ===================

// Exportar servicios individuales para acceso directo si es necesario
export { walletService, contractService };

// Exportar configuración y constantes
export { CONFIG } from '../config';
export { AGROPREDICT_ABI } from '../contracts/abi';

// Exportar utilidades
export * from './helpers';

// =================== INFORMACIÓN DE DEBUG ===================

console.log('🌐 Web3Service module loaded with:');
console.log('  - Wallet Service: ✅');
console.log('  - Contract Service: ✅');
console.log('  - Helper Functions: ✅');
console.log('  - Configuration: ✅');
console.log('  - Auto-connection: ✅');

// Export default para compatibilidad
export default web3Service;