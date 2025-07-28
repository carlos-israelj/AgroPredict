import React, { useState, useEffect } from 'react';
import { Truck, RefreshCw, Shield, Wifi, WifiOff } from 'lucide-react';

const Header = ({ 
  account, 
  balance, 
  isVerifiedFarmer, 
  onDisconnect,
  refreshBalance,
  getNetworkInfo
}) => {
  const [networkInfo, setNetworkInfo] = useState({ name: 'Cargando...', isScrollSepolia: false });
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const shortAddress = account ? `${account.slice(0,6)}...${account.slice(-4)}` : '';
  const formattedBalance = parseFloat(balance).toFixed(4);
  const balanceUSD = (parseFloat(balance) * 2500).toFixed(0); // Conversión aproximada ETH a USD

  // Detectar cambios de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar información de red
  useEffect(() => {
    if (getNetworkInfo) {
      getNetworkInfo().then(setNetworkInfo);
    }
  }, [getNetworkInfo]);

  // Refrescar balance
  const handleRefreshBalance = async () => {
    if (refreshBalance && isOnline) {
      setRefreshing(true);
      try {
        await refreshBalance();
      } catch (error) {
        console.error('Error refreshing balance:', error);
      }
      setTimeout(() => setRefreshing(false), 1000);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo y saludo */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">🌾</div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AgroPredict</h1>
              <p className="text-sm text-gray-600">
                ¡Hola {isVerifiedFarmer ? 'Agricultor' : 'Usuario'}! 
                <span className="ml-1">
                  {isVerifiedFarmer ? '🚜' : '👋'}
                </span>
              </p>
            </div>
          </div>
          
          {/* Info del usuario */}
          <div className="flex items-center gap-4">
            {/* Status de conexión */}
            {!isOnline && (
              <div className="flex items-center gap-1 text-red-600 text-xs">
                <WifiOff size={12} />
                <span>Sin internet</span>
              </div>
            )}

            {/* Balance */}
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-800">
                    {formattedBalance} ETH
                  </div>
                  <div className="text-xs text-gray-500">
                    ~${balanceUSD} USD
                  </div>
                </div>
                {refreshBalance && (
                  <button
                    onClick={handleRefreshBalance}
                    disabled={refreshing || !isOnline}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1 rounded hover:bg-gray-100 transition-colors"
                    title={isOnline ? "Refrescar balance" : "Sin conexión"}
                  >
                    <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                  </button>
                )}
              </div>
              
              {/* Dirección wallet */}
              <p className="text-xs font-mono text-gray-500">{shortAddress}</p>
              
              {/* Status de red */}
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  networkInfo.isScrollSepolia && isOnline ? 'bg-green-500' : 
                  !isOnline ? 'bg-red-500' : 'bg-yellow-500'
                }`}></span>
                <span className="text-xs text-gray-500">
                  {!isOnline ? 'Sin conexión' : networkInfo.name}
                </span>
                {isOnline && (
                  <Wifi size={10} className="text-green-500" />
                )}
              </div>
              
              {/* Status de verificación */}
              <div className="flex items-center gap-1 mt-1">
                {isVerifiedFarmer ? (
                  <>
                    <Shield size={10} className="text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Agricultor Verificado</span>
                  </>
                ) : (
                  <>
                    <Shield size={10} className="text-orange-500" />
                    <span className="text-xs text-orange-600">Verificación pendiente</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Botón desconectar */}
            {onDisconnect && (
              <button
                onClick={onDisconnect}
                className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
              >
                Salir
              </button>
            )}
          </div>
        </div>

        {/* Banner de warning si no está en Scroll Sepolia */}
        {isOnline && !networkInfo.isScrollSepolia && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700 text-center">
              ⚠️ Para usar AgroPredict, cambia a la red Scroll Sepolia en tu wallet
            </p>
          </div>
        )}

        {/* Banner offline */}
        {!isOnline && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700 text-center">
              📶 Sin conexión a internet. Algunas funciones no estarán disponibles.
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;