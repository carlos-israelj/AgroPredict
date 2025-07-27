import { ethers } from 'ethers';

// Información del contrato (actualizar después del deploy)
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '';
export const CONTRACT_ABI = [
  // ABI básico - copiar del contract-info.json después del deploy
  "function verifiedFarmers(address) view returns (bool)",
  "function mintCropToken(string,uint256,uint256,uint256,string,string) external",
  "function buyCropToken(uint256) external payable",
  "function getCropToken(uint256) view returns (tuple)",
  "function getAvailableTokens() view returns (uint256[])",
  "function getFarmerTokens(address) view returns (uint256[])",
  "function getPrediction(string) view returns (tuple)",
  "function getStats() view returns (uint256,uint256,uint256,uint256)",
  "event CropTokenMinted(uint256 indexed,address indexed,string,uint256,uint256)",
  "event CropTokenSold(uint256 indexed,address indexed,uint256)"
];

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

      // Verificar red
      await this.checkNetwork();

      // Configurar contrato
      if (CONTRACT_ADDRESS) {
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          this.signer
        );
      }

      return {
        account: this.account,
        provider: this.provider,
        contract: this.contract
      };

    } catch (error) {
      console.error('Error conectando wallet:', error);
      throw error;
    }
  }

  // Verificar que estamos en la red correcta
  async checkNetwork() {
    const network = await this.provider.getNetwork();
    const targetChainId = process.env.REACT_APP_CHAIN_ID || '534351'; // Scroll Sepolia por defecto
    
    if (network.chainId.toString() !== targetChainId) {
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
    } catch (switchError) {
      // Si la red no está agregada, la agregamos
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
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
    if (!this.contract) return false;
    
    const targetAddress = address || this.account;
    return await this.contract.verifiedFarmers(targetAddress);
  }

  // Crear token de cosecha
  async createCropToken(cropData) {
    if (!this.contract) throw new Error('Contrato no conectado');

    const { cropType, quantity, pricePerQuintal, deliveryDate, location } = cropData;
    
    // Convertir fecha a timestamp
    const deliveryTimestamp = Math.floor(new Date(deliveryDate).getTime() / 1000);
    
    // Convertir precio a wei
    const priceInWei = ethers.utils.parseEther(pricePerQuintal.toString());
    
    const tx = await this.contract.mintCropToken(
      cropType,
      quantity,
      priceInWei,
      deliveryTimestamp,
      location,
      `QmHash${Date.now()}` // IPFS hash simulado
    );

    return await tx.wait();
  }

  // Comprar token
  async buyToken(tokenId, totalPrice) {
    if (!this.contract) throw new Error('Contrato no conectado');

    const priceInWei = ethers.utils.parseEther(totalPrice.toString());
    
    const tx = await this.contract.buyCropToken(tokenId, {
      value: priceInWei
    });

    return await tx.wait();
  }

  // Obtener tokens disponibles
  async getAvailableTokens() {
    if (!this.contract) return [];

    const tokenIds = await this.contract.getAvailableTokens();
    const tokens = [];

    for (let i = 0; i < tokenIds.length; i++) {
      const tokenData = await this.contract.getCropToken(tokenIds[i]);
      tokens.push(this.formatTokenData(tokenData, tokenIds[i]));
    }

    return tokens;
  }

  // Obtener tokens del usuario
  async getFarmerTokens(address = null) {
    if (!this.contract) return [];

    const targetAddress = address || this.account;
    const tokenIds = await this.contract.getFarmerTokens(targetAddress);
    const tokens = [];

    for (let i = 0; i < tokenIds.length; i++) {
      const tokenData = await this.contract.getCropToken(tokenIds[i]);
      tokens.push(this.formatTokenData(tokenData, tokenIds[i]));
    }

    return tokens;
  }

  // Obtener predicción de precios
  async getPricePrediction(cropType) {
    if (!this.contract) return null;

    const prediction = await this.contract.getPrediction(cropType);
    
    if (prediction.timestamp.toString() === '0') return null;

    return {
      cropType: prediction.cropType,
      predictedPrice: parseFloat(ethers.utils.formatEther(prediction.predictedPrice)),
      confidence: prediction.confidence.toNumber(),
      timestamp: prediction.timestamp.toNumber(),
      targetDate: prediction.targetDate.toNumber()
    };
  }

  // Obtener estadísticas
  async getStats() {
    if (!this.contract) return null;

    const stats = await this.contract.getStats();
    
    return {
      totalTokens: stats.totalTokens.toNumber(),
      availableTokens: stats.availableTokens.toNumber(),
      soldTokens: stats.soldTokens.toNumber(),
      totalVolume: parseFloat(ethers.utils.formatEther(stats.totalVolume))
    };
  }

  // Formatear datos del token
  formatTokenData(tokenData, tokenId) {
    return {
      id: tokenId.toNumber(),
      farmer: tokenData.farmer,
      cropType: tokenData.cropType,
      quantity: tokenData.quantity.toNumber(),
      pricePerQuintal: parseFloat(ethers.utils.formatEther(tokenData.pricePerQuintal)),
      totalPrice: tokenData.quantity.toNumber() * parseFloat(ethers.utils.formatEther(tokenData.pricePerQuintal)),
      deliveryDate: new Date(tokenData.deliveryDate.toNumber() * 1000).toLocaleDateString(),
      location: tokenData.location,
      isDelivered: tokenData.isDelivered,
      isSold: tokenData.isSold,
      buyer: tokenData.buyer,
      createdAt: new Date(tokenData.createdAt.toNumber() * 1000).toLocaleDateString()
    };
  }

  // Escuchar eventos
  subscribeToEvents(callback) {
    if (!this.contract) return;

    // Escuchar tokens creados
    this.contract.on('CropTokenMinted', (tokenId, farmer, cropType, quantity, price) => {
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
      callback('TokenSold', {
        tokenId: tokenId.toNumber(),
        buyer,
        totalPrice: parseFloat(ethers.utils.formatEther(totalPrice))
      });
    });
  }

  // Desconectar
  disconnect() {
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