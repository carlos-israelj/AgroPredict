// services/walletService.js - Servicio para manejo de wallet y red
import { ethers } from 'ethers';
import { CONFIG, NETWORKS } from '../config';
import { parseWeb3Error } from '../utils/helpers';

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = '';
    this.chainId = null;
    this.isConnected = false;
    
    // Event listeners
    this.accountChangeListeners = [];
    this.networkChangeListeners = [];
    
    console.log('👛 WalletService initialized');
  }

  // =================== CONEXIÓN Y CONFIGURACIÓN ===================

  /**
   * Conecta a MetaMask y configura el provider
   * @returns {Promise<Object>} Resultado de la conexión
   */
  async connect() {
    try {
      console.log('🔗 === CONNECTING WALLET ===');
      
      // Verificar MetaMask
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask no está instalado. Por favor instala MetaMask para continuar.');
      }

      // Solicitar acceso a cuentas
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No se pudo acceder a ninguna cuenta');
      }

      // Configurar provider y signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.account = accounts[0];
      
      console.log('👤 Account connected:', this.account);

      // Verificar/cambiar red
      await this.checkAndSwitchNetwork();
      
      // Obtener chain ID actual
      const network = await this.provider.getNetwork();
      this.chainId = network.chainId;
      this.isConnected = true;
      
      console.log('🌐 Connected to network:', network.name, 'ChainID:', this.chainId);

      // Configurar listeners
      this.setupEventListeners();

      return {
        success: true,
        account: this.account,
        chainId: this.chainId,
        provider: this.provider,
        message: 'Wallet conectado exitosamente'
      };

    } catch (error) {
      console.error('❌ Error connecting wallet:', error);
      this.isConnected = false;
      
      throw new Error(parseWeb3Error(error));
    }
  }

  /**
   * Desconecta la wallet y limpia el estado
   */
  disconnect() {
    console.log('🔌 Disconnecting wallet...');
    
    this.provider = null;
    this.signer = null;
    this.account = '';
    this.chainId = null;
    this.isConnected = false;
    
    // Remover listeners
    this.removeEventListeners();
    
    console.log('✅ Wallet disconnected');
  }

  /**
   * Verifica si hay una conexión previa
   * @returns {Promise<boolean>} True si ya está conectado
   */
  async checkPreviousConnection() {
    try {
      if (typeof window.ethereum === 'undefined') {
        return false;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });
      
      if (accounts.length > 0) {
        console.log('🔄 Previous connection found, reconnecting...');
        await this.connect();
        return true;
      }
      
      return false;
    } catch (error) {
      console.log('No previous connection found');
      return false;
    }
  }

  // =================== GESTIÓN DE RED ===================

  /**
   * Verifica la red actual y cambia si es necesario
   */
  async checkAndSwitchNetwork() {
    try {
      const currentChainId = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });
      
      const targetChainId = `0x${CONFIG.CHAIN_ID.toString(16)}`;
      
      console.log('🌐 Current chain:', currentChainId);
      console.log('🎯 Target chain:', targetChainId);
      
      if (currentChainId !== targetChainId) {
        console.log('🔄 Switching to correct network...');
        await this.switchNetwork();
      } else {
        console.log('✅ Already on correct network');
      }
    } catch (error) {
      console.error('❌ Network check error:', error);
      throw new Error('Error verificando la red: ' + error.message);
    }
  }

  /**
   * Cambia a la red configurada
   */
  async switchNetwork() {
    const networkConfig = NETWORKS[CONFIG.NETWORK];
    
    if (!networkConfig) {
      throw new Error(`Red ${CONFIG.NETWORK} no está configurada`);
    }

    try {
      // Intentar cambiar a la red
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainId }],
      });
      
      console.log('✅ Network switched successfully');
      
    } catch (switchError) {
      // Si la red no está agregada (error 4902), agregarla
      if (switchError.code === 4902) {
        console.log('➕ Adding network to MetaMask...');
        
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
        
        console.log('✅ Network added and activated');
      } else {
        throw switchError;
      }
    }
  }

  /**
   * Obtiene información de la red actual
   * @returns {Promise<Object>} Información de la red
   */
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        return { chainId: 0, name: 'Desconectado', isCorrectNetwork: false };
      }

      const network = await this.provider.getNetwork();
      const isCorrectNetwork = network.chainId === CONFIG.CHAIN_ID;
      
      const networkNames = {
        534351: 'Scroll Sepolia Testnet',
        534352: 'Scroll Mainnet',
        1: 'Ethereum Mainnet',
        5: 'Goerli Testnet'
      };
      
      return {
        chainId: network.chainId,
        name: networkNames[network.chainId] || 'Red Desconocida',
        isCorrectNetwork: isCorrectNetwork
      };
    } catch (error) {
      console.error('Error getting network info:', error);
      return { chainId: 0, name: 'Error', isCorrectNetwork: false };
    }
  }

  // =================== GESTIÓN DE BALANCE ===================

  /**
   * Obtiene el balance de ETH de una dirección
   * @param {string} address - Dirección (opcional, usa la cuenta conectada por defecto)
   * @returns {Promise<string>} Balance en ETH
   */
  async getBalance(address = null) {
    try {
      if (!this.provider) {
        throw new Error('Provider no disponible');
      }
      
      const targetAddress = address || this.account;
      if (!targetAddress) {
        throw new Error('No hay cuenta conectada');
      }
      
      const balance = await this.provider.getBalance(targetAddress);
      const balanceETH = ethers.utils.formatEther(balance);
      
      console.log(`💰 Balance for ${targetAddress}: ${balanceETH} ETH`);
      return balanceETH;
      
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  /**
   * Obtiene el balance en Wei
   * @param {string} address - Dirección (opcional)
   * @returns {Promise<ethers.BigNumber>} Balance en Wei
   */
  async getBalanceWei(address = null) {
    try {
      if (!this.provider) {
        throw new Error('Provider no disponible');
      }
      
      const targetAddress = address || this.account;
      return await this.provider.getBalance(targetAddress);
      
    } catch (error) {
      console.error('Error getting balance in Wei:', error);
      return ethers.BigNumber.from(0);
    }
  }

  /**
   * Verifica si hay balance suficiente para una transacción
   * @param {string|number} amountETH - Cantidad requerida en ETH
   * @param {boolean} includeGas - Si incluir estimación de gas
   * @returns {Promise<boolean>} True si hay balance suficiente
   */
  async hasEnoughBalance(amountETH, includeGas = true) {
    try {
      const balance = await this.getBalance();
      const balanceNum = parseFloat(balance);
      const requiredNum = parseFloat(amountETH);
      
      if (!includeGas) {
        return balanceNum >= requiredNum;
      }
      
      // Estimar gas (aproximación)
      const estimatedGasCost = 0.001; // ~0.001 ETH para transacciones típicas
      return balanceNum >= (requiredNum + estimatedGasCost);
      
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }

  // =================== INFORMACIÓN DE CUENTA ===================

  /**
   * Obtiene la dirección de la cuenta conectada
   * @returns {string} Dirección de la cuenta
   */
  getAccount() {
    return this.account;
  }

  /**
   * Obtiene el provider actual
   * @returns {ethers.providers.Web3Provider|null} Provider
   */
  getProvider() {
    return this.provider;
  }

  /**
   * Obtiene el signer actual
   * @returns {ethers.providers.JsonRpcSigner|null} Signer
   */
  getSigner() {
    return this.signer;
  }

  /**
   * Verifica si la wallet está conectada
   * @returns {boolean} Estado de conexión
   */
  getIsConnected() {
    return this.isConnected && this.account && this.provider;
  }

  // =================== EVENT LISTENERS ===================

  /**
   * Configura los listeners de eventos de MetaMask
   */
  setupEventListeners() {
    if (typeof window.ethereum === 'undefined') return;

    // Listener para cambio de cuentas
    window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
    
    // Listener para cambio de red
    window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
    
    console.log('👂 Event listeners configured');
  }

  /**
   * Remueve los listeners de eventos
   */
  removeEventListeners() {
    if (typeof window.ethereum === 'undefined') return;

    window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged.bind(this));
    window.ethereum.removeListener('chainChanged', this.handleChainChanged.bind(this));
    
    console.log('🔇 Event listeners removed');
  }

  /**
   * Maneja el cambio de cuentas en MetaMask
   * @param {Array} accounts - Nuevas cuentas
   */
  async handleAccountsChanged(accounts) {
    console.log('🔄 Accounts changed:', accounts);
    
    if (accounts.length === 0) {
      // Usuario desconectó todas las cuentas
      this.disconnect();
      this.notifyAccountChange('');
    } else if (accounts[0] !== this.account) {
      // Usuario cambió de cuenta
      this.account = accounts[0];
      this.notifyAccountChange(this.account);
      console.log('👤 Account switched to:', this.account);
    }
  }

  /**
   * Maneja el cambio de red en MetaMask
   * @param {string} chainId - Nueva red
   */
  handleChainChanged(chainId) {
    console.log('🌐 Chain changed to:', chainId);
    
    // Recargar la página es la práctica recomendada por MetaMask
    // para evitar problemas de estado inconsistente
    window.location.reload();
  }

  // =================== NOTIFICACIONES ===================

  /**
   * Agrega un listener para cambios de cuenta
   * @param {Function} callback - Función callback
   */
  onAccountChange(callback) {
    this.accountChangeListeners.push(callback);
  }

  /**
   * Agrega un listener para cambios de red
   * @param {Function} callback - Función callback
   */
  onNetworkChange(callback) {
    this.networkChangeListeners.push(callback);
  }

  /**
   * Notifica a los listeners sobre cambio de cuenta
   * @param {string} newAccount - Nueva cuenta
   */
  notifyAccountChange(newAccount) {
    this.accountChangeListeners.forEach(callback => {
      try {
        callback(newAccount);
      } catch (error) {
        console.error('Error in account change callback:', error);
      }
    });
  }

  /**
   * Notifica a los listeners sobre cambio de red
   * @param {number} newChainId - Nueva red
   */
  notifyNetworkChange(newChainId) {
    this.networkChangeListeners.forEach(callback => {
      try {
        callback(newChainId);
      } catch (error) {
        console.error('Error in network change callback:', error);
      }
    });
  }

  // =================== UTILIDADES ===================

  /**
   * Formatea la dirección para mostrar
   * @param {number} start - Caracteres al inicio
   * @param {number} end - Caracteres al final
   * @returns {string} Dirección formateada
   */
  formatAddress(start = 6, end = 4) {
    if (!this.account) return '';
    return `${this.account.slice(0, start)}...${this.account.slice(-end)}`;
  }

  /**
   * Obtiene el explorador de bloques para la red actual
   * @returns {string} URL del explorador
   */
  getExplorerUrl() {
    const networkConfig = NETWORKS[CONFIG.NETWORK];
    return networkConfig?.blockExplorerUrls?.[0] || CONFIG.EXPLORER_URL;
  }

  /**
   * Genera URL para ver una transacción en el explorador
   * @param {string} txHash - Hash de la transacción
   * @returns {string} URL completa
   */
  getTxExplorerUrl(txHash) {
    return `${this.getExplorerUrl()}/tx/${txHash}`;
  }

  /**
   * Genera URL para ver una dirección en el explorador
   * @param {string} address - Dirección
   * @returns {string} URL completa
   */
  getAddressExplorerUrl(address = null) {
    const targetAddress = address || this.account;
    return `${this.getExplorerUrl()}/address/${targetAddress}`;
  }
}

// Singleton instance
export const walletService = new WalletService();

// Export también la clase para testing
export { WalletService };

console.log('👛 WalletService module loaded');