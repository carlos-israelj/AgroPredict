import { useState, useEffect, useCallback } from 'react';

export const useWallet = () => {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isVerifiedFarmer, setIsVerifiedFarmer] = useState(false);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Verificar si ya hay conexión
  const checkConnection = useCallback(async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      }
    } catch (error) {
      console.log('No hay conexión previa');
    }
  }, []);

  // Obtener balance real de la wallet
  const getRealBalance = async (address) => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        
        // Convertir de wei a ETH
        const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18);
        return balanceInEth.toFixed(6);
      }
      return '0';
    } catch (error) {
      console.error('Error obteniendo balance:', error);
      return '0';
    }
  };

  // Verificar si estamos en Scroll Sepolia
  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const scrollSepoliaChainId = '0x8274F'; // 534351 en hex
      
      if (chainId !== scrollSepoliaChainId) {
        // Intentar cambiar a Scroll Sepolia
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: scrollSepoliaChainId }],
          });
        } catch (switchError) {
          // Si la red no está agregada, agregarla
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: scrollSepoliaChainId,
                chainName: 'Scroll Sepolia Testnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia-rpc.scroll.io/'],
                blockExplorerUrls: ['https://sepolia.scrollscan.com/'],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Error verificando red:', error);
      throw new Error('Por favor conecta a Scroll Sepolia Testnet');
    }
  };

  // Conectar wallet real
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');

      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask no está instalado. Por favor instala MetaMask para continuar.');
      }

      // Verificar/cambiar a Scroll Sepolia
      await checkNetwork();

      // Solicitar acceso a cuentas
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No se pudo acceder a ninguna cuenta');
      }

      const userAccount = accounts[0];
      setAccount(userAccount);
      setIsConnected(true);

      // Obtener balance real
      const realBalance = await getRealBalance(userAccount);
      setBalance(realBalance);

      // Verificar si es agricultor (simulado por ahora)
      // En producción esto se verificaría en el smart contract
      const isVerified = true; // Para demo - en producción sería await web3Service.isVerifiedFarmer()
      setIsVerifiedFarmer(isVerified);
      console.log('✅ Usuario verificado como agricultor:', isVerified);

      // Escuchar cambios de cuenta
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return {
        success: true,
        message: '¡Wallet conectado exitosamente!'
      };

    } catch (error) {
      setError(error.message);
      console.error('Error conectando wallet:', error);
      return {
        success: false,
        message: error.message
      };
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de cuentas
  const handleAccountsChanged = useCallback(async (accounts) => {
    if (accounts.length === 0) {
      // Usuario desconectó la wallet
      disconnectWallet();
    } else if (accounts[0] !== account) {
      // Usuario cambió de cuenta
      setAccount(accounts[0]);
      const newBalance = await getRealBalance(accounts[0]);
      setBalance(newBalance);
    }
  }, [account]);

  // Manejar cambio de red
  const handleChainChanged = useCallback(() => {
    // Recargar la página cuando cambie la red
    window.location.reload();
  }, []);

  // Desconectar wallet
  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
    setIsVerifiedFarmer(false);
    setBalance('0');
    setError('');

    // Remover listeners
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  // Actualizar balance manualmente
  const refreshBalance = async () => {
    if (account) {
      const newBalance = await getRealBalance(account);
      setBalance(newBalance);
      return newBalance;
    }
    return '0';
  };

  // Simular deducción de balance (para demo)
  const deductFromBalance = (amount) => {
    const currentBalance = parseFloat(balance);
    const newBalance = Math.max(0, currentBalance - amount);
    setBalance(newBalance.toFixed(6));
    return newBalance;
  };

  // Verificar si tiene suficiente balance
  const hasEnoughBalance = (amount) => {
    return parseFloat(balance) >= amount;
  };

  // Obtener información de la red actual
  const getNetworkInfo = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdDecimal = parseInt(chainId, 16);
      
      const networks = {
        534351: 'Scroll Sepolia Testnet',
        534352: 'Scroll Mainnet',
        1: 'Ethereum Mainnet',
        5: 'Goerli Testnet'
      };
      
      return {
        chainId: chainIdDecimal,
        name: networks[chainIdDecimal] || 'Red Desconocida',
        isScrollSepolia: chainIdDecimal === 534351
      };
    } catch (error) {
      return { chainId: 0, name: 'Desconocida', isScrollSepolia: false };
    }
  };

  // Verificar al cargar
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Limpiar listeners al desmontar
  useEffect(() => {
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [handleAccountsChanged, handleChainChanged]);

  return {
    // Estado
    account,
    isConnected,
    isVerifiedFarmer,
    balance,
    loading,
    error,
    
    // Acciones
    connectWallet,
    disconnectWallet,
    refreshBalance,
    setError,
    deductFromBalance,
    
    // Utilidades
    hasEnoughBalance,
    getNetworkInfo,
    formatBalance: () => parseFloat(balance).toFixed(4),
    shortAddress: () => account ? `${account.slice(0,6)}...${account.slice(-4)}` : '',
    
    // Web3 específico
    getRealBalance
  };
};