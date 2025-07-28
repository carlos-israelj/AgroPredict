import React, { useState } from 'react';
import { MapPin, Truck, ShieldCheck, Star, User, Calendar } from 'lucide-react';
import { productData } from '../../data/productData';
import BuyTokenModal from './BuyTokenModal';

const MarketTokenCard = ({ token, currentAccount, currentBalance, onBuy }) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  
  // CAMBIO: usar token.cropType directamente (ya está en mayúsculas)
  const productInfo = productData[token.cropType] || productData['CACAO']; // fallback
  const isOwnToken = token.farmer === currentAccount;
  
  // Calcular días hasta entrega
  const deliveryTimestamp = token.deliveryTimestamp || new Date(token.deliveryDate).getTime() / 1000;
  const daysUntilDelivery = Math.ceil((deliveryTimestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
  
  // Determinar urgencia de entrega
  const getDeliveryStatus = () => {
    if (daysUntilDelivery <= 30) return { color: 'text-red-600', bg: 'bg-red-50', label: 'Entrega próxima' };
    if (daysUntilDelivery <= 90) return { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Entrega media' };
    return { color: 'text-green-600', bg: 'bg-green-50', label: 'Entrega lejana' };
  };

  const deliveryStatus = getDeliveryStatus();

  const handleBuyClick = () => {
    if (!isOwnToken) {
      setShowBuyModal(true);
    }
  };

  const handleConfirmPurchase = async (purchaseData) => {
    if (onBuy) {
      await onBuy(purchaseData);
    }
  };

  // Debug temporal
  console.log('=== DEBUG MARKET TOKEN CARD ===');
  console.log('token.cropType:', token.cropType);
  console.log('productInfo found:', !!productInfo);
  console.log('productInfo:', productInfo);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 hover:scale-[1.02] relative overflow-hidden">
        {/* Badge de disponibilidad */}
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold shadow-sm">
            📦 Disponible
          </span>
        </div>

        {/* Header del token */}
        <div className="p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{productInfo?.emoji || '🌾'}</div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-800 mb-1">
                {token.cropType} - {token.variety || 'Estándar'}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                <MapPin size={12} />
                {token.location}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <User size={10} />
                Agricultor: {token.farmer.slice(0,6)}...{token.farmer.slice(-4)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {/* Información principal */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="font-bold text-lg text-blue-600">{token.quantity}</div>
              <div className="text-gray-600">{productInfo?.unit || 'unidades'}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="font-bold text-lg text-green-600">
                ${token.pricePerUnitUSD}
              </div>
              <div className="text-gray-600">por {productInfo?.unit}</div>
            </div>
          </div>

          {/* Calidad y certificaciones */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star size={14} className="text-yellow-500" />
              <span className="text-sm font-medium">Calidad {token.qualityGrade}</span>
            </div>
            {token.organicCertified && (
              <div className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-green-600" />
                <span className="text-xs text-green-700 font-medium">Orgánico</span>
              </div>
            )}
          </div>

          {/* Información de entrega */}
          <div className={`${deliveryStatus.bg} rounded-lg p-3 border border-gray-200`}>
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className={deliveryStatus.color} />
              <span className="text-sm font-medium text-gray-700">Entrega</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">{token.deliveryDate}</div>
            <div className={`text-xs ${deliveryStatus.color} font-medium`}>
              {daysUntilDelivery > 0 ? `${daysUntilDelivery} días restantes` : 'Vencido'}
            </div>
          </div>

          {/* Precio total destacado */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Precio Total</div>
              <div className="text-2xl font-bold text-blue-600">
                ${token.totalPriceUSD?.toLocaleString() || (token.quantity * token.pricePerUnitUSD).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {(token.totalPriceETH || (token.quantity * token.pricePerUnitETH)).toFixed(4)} ETH
              </div>
            </div>
          </div>

          {/* Indicador de balance */}
          {!isOwnToken && (
            <div className="text-xs text-center">
              {currentBalance >= (token.totalPriceETH || token.quantity * token.pricePerUnitETH) ? (
                <span className="text-green-600 font-medium">
                  ✅ Tienes suficiente balance
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ⚠️ Balance insuficiente
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer con botón */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={handleBuyClick}
            disabled={isOwnToken || daysUntilDelivery <= 0}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
              isOwnToken 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : daysUntilDelivery <= 0
                ? 'bg-red-200 text-red-600 cursor-not-allowed'
                : currentBalance >= (token.totalPriceETH || token.quantity * token.pricePerUnitETH)
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isOwnToken ? (
              <>
                <User size={16} className="inline mr-2" />
                Tu propio token
              </>
            ) : daysUntilDelivery <= 0 ? (
              <>
                <Calendar size={16} className="inline mr-2" />
                Vencido
              </>
            ) : (
              <>
                <Truck size={16} className="inline mr-2" />
                Comprar ahora
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal de compra */}
      {showBuyModal && (
        <BuyTokenModal
          token={token}
          currentBalance={currentBalance}
          onClose={() => setShowBuyModal(false)}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </>
  );
};

export default MarketTokenCard;