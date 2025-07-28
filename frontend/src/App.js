import React, { useState } from 'react';
import './App.css';

// Hooks
import { useWallet } from './hooks/useWallet';
import { useTokens } from './hooks/useTokens';

// Componentes comunes
import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import AlertMessage from './components/common/AlertMessage';

// Componentes de pantallas
import ConnectScreen from './components/auth/ConnectScreen';
import PricePredictionSystem from './components/predictions/PricePredictionSystem';
import MyTokensSystem from './components/tokenization/MyTokensSystem';
import MarketplaceSystem from './components/marketplace/MarketplaceSystem';

const AgroPredictApp = () => {
  // Estados principales
  const [activeTab, setActiveTab] = useState('predicciones');
  const [success, setSuccess] = useState('');

  // Hooks personalizados
  const {
    account,
    isConnected,
    isVerifiedFarmer,
    balance,
    loading: walletLoading,
    error: walletError,
    connectWallet,
    disconnectWallet,
    setError: setWalletError,
    deductFromBalance,
    hasEnoughBalance,
    refreshBalance,        // Añadir esta
    getNetworkInfo
  } = useWallet();

  const {
    myTokens,
    marketTokens,
    stats,
    loading: tokensLoading,
    createToken,
    buyToken
  } = useTokens(isConnected);

  // Manejar conexión de wallet
  const handleConnect = async () => {
    const result = await connectWallet();
    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  // Manejar creación de token
  const handleCreateToken = async (tokenData) => {
    try {
      const result = await createToken(tokenData);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => setSuccess(''), 5000);
      }
      return result;
    } catch (error) {
      setWalletError('Error creando token: ' + error.message);
      return { success: false, message: error.message };
    }
  };

  // Manejar tokenización desde predicciones
  const handleTokenize = (cropType) => {
    // Cambiar a la pestaña de tokens para iniciar tokenización
    setActiveTab('mis-tokens');
    // Mostrar mensaje informativo
    setSuccess(`Redirigiendo para tokenizar ${cropType}. Haz clic en "Crear Token" para comenzar.`);
    setTimeout(() => setSuccess(''), 4000);
  };


// Manejar compra de token
  const handleBuyToken = async (purchaseData) => {
    console.log('=== 🛒 APP.JS HANDLE BUY TOKEN ===');
    console.log('🛒 purchaseData received:', purchaseData);
    console.log('🛒 purchaseData type:', typeof purchaseData);
    console.log('🛒 purchaseData keys:', Object.keys(purchaseData));
    
    try {
      const { tokenId, quantity, totalPrice, remainingQuantity } = purchaseData;
      
      console.log('🔍 Destructured data:');
      console.log('🔍 tokenId:', tokenId);
      console.log('🔍 quantity:', quantity);
      console.log('🔍 totalPrice:', totalPrice);
      console.log('🔍 remainingQuantity:', remainingQuantity);
      console.log('🔍 current balance:', balance);
      
      // Verificar balance suficiente
      console.log('💰 Checking balance...');
      const hasEnough = hasEnoughBalance(totalPrice);
      console.log('💰 hasEnoughBalance result:', hasEnough);
      console.log('💰 balance:', parseFloat(balance));
      console.log('💰 totalPrice needed:', totalPrice);
      console.log('💰 difference:', parseFloat(balance) - totalPrice);
      
      if (!hasEnough) {
        console.log('❌ INSUFFICIENT BALANCE in App.js');
        throw new Error('Balance insuficiente para esta compra');
      }
      
      console.log('✅ Balance sufficient, proceeding with purchase...');
      
      // Procesar la compra
      console.log('📞 Calling buyToken from useTokens hook...');
      console.log('📞 buyToken function type:', typeof buyToken);
      
      const result = await buyToken(tokenId, totalPrice);
      
      console.log('📨 buyToken result:', result);
      console.log('📨 result type:', typeof result);
      
      // Deducir del balance
      console.log('💸 Deducting from balance...');
      const newBalance = deductFromBalance(totalPrice);
      console.log('💸 New balance after deduction:', newBalance);
      
      const successMessage = `🎉 ¡Compra exitosa! ` +
        `Has adquirido ${quantity} unidades por $${(totalPrice * 2500).toLocaleString()}. ` +
        `Balance actualizado: ${newBalance.toFixed(4)} ETH`;
      
      console.log('✅ Setting success message:', successMessage);
      setSuccess(successMessage);
      
      setTimeout(() => {
        console.log('🧹 Clearing success message');
        setSuccess('');
      }, 6000);
      
      return { success: true, message: 'Compra completada exitosamente' };
      
    } catch (error) {
      console.log('=== ❌ BUY TOKEN ERROR in App.js ===');
      console.error('❌ Error in handleBuyToken:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      const errorMessage = 'Error en la compra: ' + error.message;
      console.log('❌ Setting error message:', errorMessage);
      setWalletError(errorMessage);
      
      return { success: false, message: error.message };
    }
  };

  // Pantalla de conexión
  if (!isConnected) {
    return (
      <ConnectScreen
        onConnect={handleConnect}
        loading={walletLoading}
        error={walletError}
        onClearError={() => setWalletError('')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        account={account}
        balance={balance}
        isVerifiedFarmer={isVerifiedFarmer}
        onDisconnect={disconnectWallet}
        refreshBalance={refreshBalance}
        getNetworkInfo={getNetworkInfo}
      />

      {/* Alerts */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        {walletError && (
          <AlertMessage 
            type="error" 
            message={walletError} 
            onClose={() => setWalletError('')}
            autoClose={false}
          />
        )}
        {success && (
          <AlertMessage 
            type="success" 
            message={success} 
            onClose={() => setSuccess('')}
            autoClose={true}
          />
        )}
      </div>

      {/* Navigation */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Loading overlay */}
      {(walletLoading || tokensLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="text-gray-700">Cargando...</span>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'predicciones' && (
          <PricePredictionSystem
            onTokenize={handleTokenize}
            isVerifiedFarmer={isVerifiedFarmer}
          />
        )}

        {activeTab === 'mis-tokens' && (
          <MyTokensSystem
            tokens={myTokens}
            isVerifiedFarmer={isVerifiedFarmer}
            onCreateToken={handleCreateToken}
            stats={stats}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceSystem
            tokens={marketTokens}
            currentAccount={account}
            currentBalance={parseFloat(balance)}
            onBuyToken={handleBuyToken}
            stats={stats}
          />
        )}
      </main>

      {/* Footer informativo (opcional) */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>🌾 AgroPredict MVP - Empoderando agricultores ecuatorianos con blockchain</p>
            <p className="mt-1">
              Contrato deployado en Scroll Sepolia: 
              <span className="font-mono ml-1">0xE73082676Feeb5fAd9a262f57EaC3450E0bA1d91</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgroPredictApp;