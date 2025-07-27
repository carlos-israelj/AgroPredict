import React, { useState, useEffect, useCallback } from 'react';
import { Wallet, Truck, TrendingUp, DollarSign, Package, Phone, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { web3Service } from './utils/web3';
import './App.css';

const AgroPredictApp = () => {
  // Estados principales
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isVerifiedFarmer, setIsVerifiedFarmer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('predicciones');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados de datos
  const [predictions, setPredictions] = useState({});
  const [myTokens, setMyTokens] = useState([]);
  const [marketTokens, setMarketTokens] = useState([]);
  const [stats, setStats] = useState(null);
  const [balance, setBalance] = useState('0');

  // Estados para modales
  const [showTokenizeForm, setShowTokenizeForm] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('');

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

  // Suscribirse a eventos del contrato
  const subscribeToEvents = useCallback(() => {
    web3Service.subscribeToEvents((eventType, data) => {
      if (eventType === 'TokenMinted') {
        setSuccess(`¡Token creado! ${data.quantity} quintales de ${data.cropType}`);
        loadData(); // Recargar datos
      } else if (eventType === 'TokenSold') {
        setSuccess(`¡Token vendido por $${data.totalPrice}!`);
        loadData(); // Recargar datos
      }
    });
  }, []);

  // Conectar wallet al cargar
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Cargar datos cuando se conecta
  useEffect(() => {
    if (isConnected) {
      loadData();
      subscribeToEvents();
    }
  }, [isConnected, subscribeToEvents]);

  // Conectar wallet
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError('');
      
      const connection = await web3Service.connectWallet();
      
      setAccount(connection.account);
      setIsConnected(true);
      
      // Verificar si es agricultor
      const verified = await web3Service.isVerifiedFarmer();
      setIsVerifiedFarmer(verified);
      
      // Obtener balance
      const userBalance = await web3Service.getBalance();
      setBalance(userBalance);
      
      setSuccess('¡Wallet conectado exitosamente!');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError(error.message);
      console.error('Error conectando wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los datos
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar predicciones (usar datos simulados por ahora)
      setPredictions({
        CACAO: { predictedPrice: 165, confidence: 85, targetDate: Date.now() + 45 * 24 * 60 * 60 * 1000 },
        BANANO: { predictedPrice: 30, confidence: 78, targetDate: Date.now() + 30 * 24 * 60 * 60 * 1000 }
      });
      
      // Simular datos para demo
      setMyTokens([
        {
          id: 1,
          cropType: 'CACAO',
          quantity: 50,
          pricePerQuintal: 140,
          totalPrice: 7000,
          isSold: false,
          deliveryDate: '2025-12-15',
          location: 'Tenguel, Guayas'
        }
      ]);
      
      setMarketTokens([
        {
          id: 2,
          cropType: 'BANANO',
          quantity: 100,
          pricePerQuintal: 25,
          totalPrice: 2500,
          location: 'Machala, El Oro',
          farmer: '0x123...456',
          deliveryDate: '2025-11-01'
        }
      ]);
      
      setStats({
        totalTokens: 3,
        availableTokens: 2,
        soldTokens: 1,
        totalVolume: 9500
      });
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error cargando datos del contrato');
    } finally {
      setLoading(false);
    }
  };

  // Componentes
  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-colors ${
        active 
          ? 'bg-green-600 text-white' 
          : 'bg-white text-green-600 border border-green-600'
      }`}
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const AlertMessage = ({ type, message, onClose }) => (
    <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
      type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-green-50 text-green-700 border border-green-200'
    }`}>
      {type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
    </div>
  );

  // Pantalla de conexión
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <Truck className="mx-auto mb-4 text-green-600" size={64} />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">AgroPredict</h1>
            <p className="text-gray-600">Tokeniza tu cosecha y vende al mejor precio</p>
          </div>
          
          {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
          
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Wallet size={20} />
            {loading ? 'Conectando...' : 'Conectar Billetera'}
          </button>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>¿Necesitas ayuda?</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="tel:+593999999999" className="flex items-center gap-1 text-green-600 hover:underline">
                <Phone size={14} />
                Llamar
              </a>
              <a href="https://wa.me/593999999999" className="flex items-center gap-1 text-green-600 hover:underline">
                <MessageCircle size={14} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="text-green-600" size={32} />
              <div>
                <h1 className="text-xl font-bold text-gray-800">AgroPredict</h1>
                <p className="text-sm text-gray-600">
                  ¡Hola {isVerifiedFarmer ? 'Agricultor' : 'Usuario'}! 👋
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Balance: {parseFloat(balance).toFixed(4)} ETH
              </p>
              <p className="text-xs font-mono">{account.slice(0,6)}...{account.slice(-4)}</p>
              {!isVerifiedFarmer && (
                <p className="text-xs text-orange-600">No verificado</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Alerts */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        {error && <AlertMessage type="error" message={error} onClose={() => setError('')} />}
        {success && <AlertMessage type="success" message={success} onClose={() => setSuccess('')} />}
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex">
            <TabButton
              id="predicciones"
              label="Predicciones"
              icon={TrendingUp}
              active={activeTab === 'predicciones'}
              onClick={setActiveTab}
            />
            <TabButton
              id="mis-tokens"
              label="Mis Tokens"
              icon={Package}
              active={activeTab === 'mis-tokens'}
              onClick={setActiveTab}
            />
            <TabButton
              id="marketplace"
              label="Marketplace"
              icon={DollarSign}
              active={activeTab === 'marketplace'}
              onClick={setActiveTab}
            />
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'predicciones' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">📊 Predicciones de Precios</h2>
              <p className="text-gray-600">Nuestro sistema de IA predice los mejores momentos para vender</p>
            </div>
            
            {stats && (
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <h3 className="font-bold mb-3">📈 Estadísticas de la Plataforma</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.totalTokens}</div>
                    <div className="text-sm text-gray-600">Tokens Totales</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.availableTokens}</div>
                    <div className="text-sm text-gray-600">Disponibles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{stats.soldTokens}</div>
                    <div className="text-sm text-gray-600">Vendidos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">${stats.totalVolume.toFixed(0)}</div>
                    <div className="text-sm text-gray-600">Volumen Total</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-800 mb-2">💡 Consejo del día</h3>
              <p className="text-blue-700">
                El precio del cacao está subiendo. ¡Es buen momento para tokenizar tu próxima cosecha!
              </p>
            </div>
          </div>
        )}

        {activeTab === 'mis-tokens' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🌾 Mis Tokens de Cosecha</h2>
              <p className="text-gray-600">Gestiona tus cosechas tokenizadas</p>
            </div>
            
            <div className="text-center py-12">
              <Package className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Demo: Conecta Web3 para ver tokens reales</h3>
              <p className="text-gray-500">
                Los tokens aparecerán cuando conectes con el contrato deployado
              </p>
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🛒 Marketplace</h2>
              <p className="text-gray-600">Compra cosechas futuras de otros agricultores</p>
            </div>
            
            <div className="text-center py-12">
              <DollarSign className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Demo: Conecta Web3 para marketplace real</h3>
              <p className="text-gray-500">
                Los tokens disponibles aparecerán cuando conectes con el contrato
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AgroPredictApp;
