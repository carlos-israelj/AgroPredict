import React, { useState } from 'react';
import { DollarSign, Package, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { productData } from '../../data/productData';

const BuyTokenModal = ({ token, currentBalance, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 🔧 FIX: usar token.cropType directamente (ya está en mayúsculas)
  const productInfo = productData[token.cropType] || productData['CACAO'];
  const maxQuantity = token.quantity;
  
  // 🔧 FIX CRÍTICO: Calcular precios correctamente
  console.log('=== DEBUG BUY TOKEN MODAL ===');
  console.log('token completo:', token);
  console.log('token.pricePerUnitUSD:', token.pricePerUnitUSD);
  console.log('token.pricePerUnitETH:', token.pricePerUnitETH);
  console.log('currentBalance:', currentBalance);
  
  // El token debe tener el precio en USD (como $10), necesitamos convertir a ETH para el pago
  const pricePerUnitUSD = token.pricePerUnitUSD || token.pricePerUnit || 10; // Fallback
  const ETH_USD_RATE = 2500; // 1 ETH = $2500 USD (ajustar según mercado)
  const pricePerUnitETH = pricePerUnitUSD / ETH_USD_RATE; // Conversión USD -> ETH
  
  const totalPriceUSD = quantity * pricePerUnitUSD;
  const totalPriceETH = quantity * pricePerUnitETH;
  const remainingTokens = maxQuantity - quantity;
  const hasEnoughBalance = currentBalance >= totalPriceETH;

  console.log('Precios calculados:');
  console.log('pricePerUnitUSD:', pricePerUnitUSD);
  console.log('pricePerUnitETH:', pricePerUnitETH);
  console.log('totalPriceUSD:', totalPriceUSD);
  console.log('totalPriceETH:', totalPriceETH);
  console.log('hasEnoughBalance:', hasEnoughBalance);

  const handleQuantityChange = (newQuantity) => {
    const validQuantity = Math.max(1, Math.min(newQuantity, maxQuantity));
    setQuantity(validQuantity);
  };

  const handleConfirm = async () => {
    if (!hasEnoughBalance) {
      alert('Balance insuficiente para esta compra');
      return;
    }

    try {
      setLoading(true);
      console.log('=== CONFIRMING PURCHASE ===');
      console.log('Sending totalPriceETH:', totalPriceETH);
      
      // 🔧 FIX: Enviar el precio en ETH (lo que espera el contrato)
      await onConfirm({
        tokenId: token.id,
        quantity: quantity,
        totalPrice: totalPriceETH, // ✅ Enviar en ETH
        totalPriceUSD: totalPriceUSD, // Para referencia
        remainingQuantity: remainingTokens
      });
      onClose();
    } catch (error) {
      console.error('Error en la compra:', error);
      alert('Error al procesar la compra. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <DollarSign size={20} className="text-blue-600" />
              Comprar Token
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Información del token */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{productInfo?.emoji || '🌾'}</span>
              <div>
                <h3 className="font-bold">{token.cropType} - {token.variety || 'Estándar'}</h3>
                <p className="text-sm text-gray-600">{token.location}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Disponible:</span>
                <span className="ml-1 font-medium">{token.quantity} {productInfo?.unit}</span>
              </div>
              <div>
                <span className="text-gray-600">Precio/unidad:</span>
                <span className="ml-1 font-medium">${pricePerUnitUSD}</span>
              </div>
              <div>
                <span className="text-gray-600">Calidad:</span>
                <span className="ml-1 font-medium">{token.qualityGrade || 'A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Entrega:</span>
                <span className="ml-1 font-medium">{token.deliveryDate}</span>
              </div>
            </div>
          </div>

          {/* Selector de cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad a comprar ({productInfo?.unit})
            </label>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              
              <input
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="flex-1 text-center p-2 border border-gray-300 rounded-lg font-bold text-lg"
              />
              
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= maxQuantity}
                className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>Mínimo: 1 {productInfo?.unit}</span>
              <span>Máximo: {maxQuantity} {productInfo?.unit}</span>
            </div>
          </div>

          {/* Controles rápidos de cantidad */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Cantidad rápida:</p>
            <div className="flex gap-2">
              {[
                { label: '25%', value: Math.ceil(maxQuantity * 0.25) },
                { label: '50%', value: Math.ceil(maxQuantity * 0.5) },
                { label: '75%', value: Math.ceil(maxQuantity * 0.75) },
                { label: 'Todo', value: maxQuantity }
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => setQuantity(option.value)}
                  className="flex-1 py-1 px-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-800 mb-3">💰 Resumen de Compra</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Cantidad:</span>
                <span className="font-medium">{quantity} {productInfo?.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Precio unitario:</span>
                <div className="text-right">
                  <span className="font-medium">${pricePerUnitUSD} USD</span>
                  <div className="text-xs text-gray-500">({pricePerUnitETH.toFixed(6)} ETH)</div>
                </div>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-bold">Total a pagar:</span>
                <div className="text-right">
                  <span className="font-bold text-blue-600">{totalPriceETH.toFixed(6)} ETH</span>
                  <div className="text-xs text-gray-500">(~${totalPriceUSD.toLocaleString()} USD)</div>
                </div>
              </div>
              
              {remainingTokens > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Restante en token:</span>
                  <span>{remainingTokens} {productInfo?.unit}</span>
                </div>
              )}
            </div>
          </div>

          {/* Balance y validación */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Tu balance actual:</span>
              <span className="font-bold">{currentBalance.toFixed(6)} ETH</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Después de la compra:</span>
              <span className={`font-bold ${hasEnoughBalance ? 'text-green-600' : 'text-red-600'}`}>
                {(currentBalance - totalPriceETH).toFixed(6)} ETH
              </span>
            </div>
          </div>

          {/* Alertas */}
          {!hasEnoughBalance && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600" />
              <span className="text-sm text-red-700">
                Balance insuficiente. Necesitas {(totalPriceETH - currentBalance).toFixed(6)} ETH adicionales.
              </span>
            </div>
          )}

          {remainingTokens === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
              <Package size={16} className="text-yellow-600" />
              <span className="text-sm text-yellow-700">
                Vas a comprar todo el token. El agricultor no tendrá más unidades disponibles.
              </span>
            </div>
          )}

          {hasEnoughBalance && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm text-green-700">
                ¡Perfecto! Tienes suficiente balance para esta compra.
              </span>
            </div>
          )}

          {/* Términos de compra */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="text-sm font-bold text-blue-800 mb-1">📋 Términos de Compra:</h5>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• El pago se procesará inmediatamente en blockchain</li>
              <li>• Recibirás el producto en la fecha acordada</li>
              <li>• Puedes coordinar entrega con el agricultor</li>
              <li>• Comisión de plataforma incluida en el precio</li>
            </ul>
          </div>

          {/* Debug info en desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 border rounded-lg p-3 text-xs">
              <h5 className="font-bold mb-1">🐛 Debug Info:</h5>
              <div>Token ID: {token.id}</div>
              <div>Precio USD: {pricePerUnitUSD}</div>
              <div>Precio ETH: {pricePerUnitETH.toFixed(8)}</div>
              <div>Total ETH: {totalPriceETH.toFixed(8)}</div>
              <div>Balance: {currentBalance.toFixed(8)}</div>
              <div>Suficiente: {hasEnoughBalance ? 'Sí' : 'No'}</div>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!hasEnoughBalance || loading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                  Procesando...
                </>
              ) : (
                `💰 Comprar ${quantity} ${productInfo?.unit}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyTokenModal;