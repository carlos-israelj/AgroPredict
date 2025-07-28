import { useState, useEffect } from 'react';
import { web3Service } from '../utils/web3';
import { productData } from '../data/productData';

export const useTokens = (isConnected) => {
  const [myTokens, setMyTokens] = useState([]);
  const [marketTokens, setMarketTokens] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos del smart contract
  useEffect(() => {
    if (isConnected) {
      loadDataFromContract();
      subscribeToEvents();
    }
  }, [isConnected]);


  // Función loadDataFromContract con debug extensivo
  const loadDataFromContract = async () => {
    try {
        setLoading(true);
        
        console.log('🔄 === LOAD DATA FROM CONTRACT ===');
        
        // Importar y verificar web3Service
        const { web3Service } = await import('../utils/web3');
        
        console.log('🔗 web3Service estado:');
        console.log('  - contract:', !!web3Service.contract);
        console.log('  - account:', web3Service.account);
        console.log('  - provider:', !!web3Service.provider);
        
        // Forzar conexión si no está conectado
        if (!web3Service.contract || !web3Service.account) {
        console.log('⚡ Forzando conexión del web3Service...');
        await web3Service.connectWallet();
        console.log('✅ web3Service conectado');
        }
        
        // Verificar conexión final
        if (!web3Service.contract) {
        console.error('❌ No se pudo conectar al contrato');
        return;
        }
        
        console.log('📥 Obteniendo tokens del agricultor...');
        console.log('   Account:', web3Service.account);
        
        // Cargar mis tokens del smart contract
        const myTokensData = await web3Service.getFarmerTokens();
        
        console.log('🌾 TOKENS RAW del contrato:', myTokensData);
        console.log('🌾 Cantidad de tokens obtenidos:', myTokensData.length);
        
        if (myTokensData.length > 0) {
        console.log('🔍 Primer token del contrato:', myTokensData[0]);
        }
        
        // Formatear tokens para la UI
        const formattedMyTokens = myTokensData.map((token, index) => {
        console.log(`📝 Formateando token ${index}:`, token);
        
        const formatted = {
            ...token,
            pricePerUnitUSD: token.pricePerQuintal,           // ✅ Ya está en USD
            pricePerUnitETH: token.pricePerQuintal / 2500,    // ✅ Convertir a ETH
            totalPriceUSD: token.totalPrice,                  // ✅ Ya está en USD  
            totalPriceETH: token.totalPrice / 2500,           // ✅ Convertir a ETH
            
            variety: getVarietyFromCropType(token.cropType),
            qualityGrade: 'A',
            organicCertified: false,
            description: `${token.cropType} de ${token.location}`

        };
        
        console.log(`✅ Token ${index} formateado:`, formatted);
        return formatted;
        });
        
        console.log('📋 Tokens formateados finales:', formattedMyTokens);
        
        // Actualizar estado
        setMyTokens(formattedMyTokens);
        
        console.log('✅ setMyTokens llamado con:', formattedMyTokens.length, 'tokens');
        
        // También cargar tokens del marketplace y stats
        console.log('📥 Cargando tokens del marketplace...');
        const marketTokensData = await web3Service.getAvailableTokens();
        console.log('🛒 Tokens del marketplace:', marketTokensData.length);
        
        const formattedMarketTokens = marketTokensData.map(token => ({
        ...token,
        pricePerUnitUSD: token.pricePerQuintal,           // ✅ Ya está en USD
        pricePerUnitETH: token.pricePerQuintal / 2500,    // ✅ Convertir a ETH
        totalPriceUSD: token.totalPrice,                  // ✅ Ya está en USD
        totalPriceETH: token.totalPrice / 2500,           // ✅ Convertir a ETH
        
        variety: getVarietyFromCropType(token.cropType),
        qualityGrade: 'A',
        organicCertified: Math.random() > 0.5
        }));
        setMarketTokens(formattedMarketTokens);
        
        // Cargar estadísticas
        console.log('📊 Cargando estadísticas...');
        const statsData = await web3Service.getStats();
        console.log('📊 Stats obtenidas:', statsData);
        
        setStats({
        ...statsData,
        totalVolumeUSD: statsData.totalVolume * 2500,
        totalVolumeETH: statsData.totalVolume
        });
        
        console.log('🎉 loadDataFromContract COMPLETADO');
        
    } catch (error) {
        console.error('❌ Error cargando datos del contrato:', error);
        console.error('Error stack:', error.stack);
    } finally {
        setLoading(false);
    }
  };

  // Crear nuevo token en el smart contract
  // Crear nuevo token - FUNCIÓN COMPLETA ACTUALIZADA
const createToken = async (tokenData) => {
  try {
    setLoading(true);
    
    console.log('🔗 Iniciando creación de token...');
    console.log('tokenData recibida:', tokenData);
    
    // FORZAR CONEXIÓN DEL CONTRATO
    console.log('🔗 Forzando conexión del contrato...');
    
    // Importar web3Service dinámicamente
    const { web3Service } = await import('../utils/web3');
    
    console.log('web3Service antes de conectar:', {
      contract: !!web3Service.contract,
      account: web3Service.account,
      provider: !!web3Service.provider
    });
    
    // Forzar conexión si no está conectado
    if (!web3Service.contract || !web3Service.account) {
      console.log('⚡ Conectando wallet y contrato...');
      await web3Service.connectWallet();
    }
    
    console.log('web3Service después de conectar:', {
      contract: !!web3Service.contract,
      account: web3Service.account,
      provider: !!web3Service.provider
    });
    
    // Verificar que el contrato esté realmente conectado
    if (!web3Service.contract) {
      throw new Error('No se pudo conectar al contrato. Verifica tu conexión de red.');
    }
    
    console.log('✅ Contrato conectado correctamente');
    
    // Obtener precio del producto
    const productInfo = productData[tokenData.cropType];
    const pricePerQuintalETH = productInfo.currentPriceETH;
    
    console.log('📊 Información del producto:', {
      cropType: tokenData.cropType,
      pricePerQuintalUSD: productInfo.currentPriceUSD,
      pricePerQuintalETH: pricePerQuintalETH
    });
    
    // Preparar datos para el smart contract
    const contractData = {
      cropType: tokenData.cropType,
      quantity: parseInt(tokenData.quantity),
      pricePerQuintal: pricePerQuintalETH,
      deliveryDate: tokenData.deliveryDate,
      location: tokenData.location
    };
    
    console.log('📝 Datos para el contrato:', contractData);
    
    // Crear token en el smart contract
    console.log('🚀 Enviando transacción al smart contract...');
    const receipt = await web3Service.createCropToken(contractData);
    
    console.log('✅ Token creado exitosamente en blockchain:', receipt);
    
    // Recargar datos
    await loadDataFromContract();
    
    const totalValueUSD = parseInt(tokenData.quantity) * productInfo.currentPriceUSD;
    const immediatePaymentUSD = totalValueUSD * 0.7;
    
    return {
      success: true,
      message: `🎉 ¡Token de ${tokenData.cropType} creado exitosamente! Recibirás ~$${immediatePaymentUSD.toLocaleString()} inmediatamente.`,
      txHash: receipt.transactionHash
    };
    
  } catch (error) {
    console.error('❌ Error creando token:', error);
    
    // Mensajes de error más específicos
    let errorMessage = 'Error al crear el token';
    
    if (error.message.includes('insufficient funds')) {
      errorMessage = 'Balance insuficiente para pagar las comisiones de transacción';
    } else if (error.message.includes('user rejected')) {
      errorMessage = 'Transacción cancelada por el usuario';
    } else if (error.message.includes('network')) {
      errorMessage = 'Error de conexión. Verifica tu red y MetaMask';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  } finally {
    setLoading(false);
  }
  };

  // Comprar token del smart contract
  const buyToken = async (tokenId, totalPriceETH) => {
    try {
      setLoading(true);
      
      // Verificar balance suficiente
      const balance = await web3Service.getBalance();
      if (parseFloat(balance) < totalPriceETH) {
        throw new Error('Balance insuficiente para esta compra');
      }
      
      // Ejecutar compra en el smart contract
      const receipt = await web3Service.buyToken(tokenId, totalPriceETH);
      
      console.log('Compra exitosa:', receipt);
      
      // Recargar datos
      await loadDataFromContract();
      
      return {
        success: true,
        message: `¡Compra exitosa! Hash de transacción: ${receipt.transactionHash}`,
        txHash: receipt.transactionHash
      };
      
    } catch (error) {
      console.error('Error comprando token:', error);
      throw new Error(error.message || 'Error al procesar la compra');
    } finally {
      setLoading(false);
    }
  };

  // Suscribirse a eventos del smart contract
  const subscribeToEvents = () => {
    web3Service.subscribeToEvents((eventType, eventData) => {
      console.log('Evento del smart contract:', eventType, eventData);
      
      switch (eventType) {
        case 'TokenMinted':
          // Recargar mis tokens cuando se crea uno nuevo
          loadDataFromContract();
          break;
        case 'TokenSold':
          // Recargar marketplace cuando se vende un token
          loadDataFromContract();
          break;
        default:
          break;
      }
    });
  };

  // Utilities
  const convertETHtoUSD = (ethAmount, rate = 2500) => {
    return (ethAmount * rate).toFixed(0);
  };

  // Utilidad helper
  const getVarietyFromCropType = (cropType) => {
    const varieties = {
        'CACAO': 'Nacional',
        'MAIZ': 'Amarillo Duro',
        'PLATANO': 'Verde Export',
        'ARROZ': 'INIAP 15',
        'CAFE': 'Arábica'
    };
    return varieties[cropType] || 'Estándar';
    };

  return {
    // Estado
    myTokens,
    marketTokens, 
    stats,
    loading,
    
    // Acciones del smart contract
    createToken,
    buyToken,
    loadDataFromContract,
    
    // Utilities
    filterTokens: (tokens, filters = {}) => {
      return tokens.filter(token => {
        if (filters.cropType && token.cropType !== filters.cropType) return false;
        if (filters.maxPriceETH && token.totalPriceETH > filters.maxPriceETH) return false;
        if (filters.minPriceETH && token.totalPriceETH < filters.minPriceETH) return false;
        if (filters.organicOnly && !token.organicCertified) return false;
        return true;
      });
    }
  };
};