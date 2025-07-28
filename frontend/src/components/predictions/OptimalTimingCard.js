import React from 'react';
import { Lightbulb, Package } from 'lucide-react';

const OptimalTimingCard = ({ 
  product, 
  bestMonth, 
  worstMonth, 
  onTokenize, 
  isVerifiedFarmer, 
  selectedProduct 
}) => {
  // CAMBIO PRINCIPAL: usar .priceUSD en lugar de .price
  const potentialGain = bestMonth.priceUSD - worstMonth.priceUSD;
  const percentageGain = ((potentialGain / worstMonth.priceUSD) * 100).toFixed(1);
  
  const handleTokenize = () => {
    if (onTokenize && isVerifiedFarmer) {
      onTokenize(selectedProduct);
    }
  };

  // Debug temporal
  console.log('=== DEBUG OPTIMAL TIMING ===');
  console.log('bestMonth:', bestMonth);
  console.log('worstMonth:', worstMonth);
  console.log('bestMonth.priceUSD:', bestMonth.priceUSD);
  console.log('worstMonth.priceUSD:', worstMonth.priceUSD);
  console.log('potentialGain:', potentialGain);
  console.log('percentageGain:', percentageGain);

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <Lightbulb size={20} className="text-yellow-600" />
        Estrategia Óptima de Venta
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-3 border border-green-200">
          <h4 className="font-bold text-green-700 mb-2">🎯 Mejor momento</h4>
          <div className="text-2xl font-bold text-green-600">
            {bestMonth.month}
          </div>
          <div className="text-lg font-semibold">
            ${bestMonth.priceUSD}/{product.unit}
          </div>
          <div className="text-sm text-gray-600">
            Confianza: {bestMonth.confidence}%
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-red-200">
          <h4 className="font-bold text-red-700 mb-2">⚠️ Evitar vender en</h4>
          <div className="text-xl font-bold text-red-600">
            {worstMonth.month}
          </div>
          <div className="text-lg font-semibold">
            ${worstMonth.priceUSD}/{product.unit}
          </div>
          <div className="text-sm text-gray-600">
            Confianza: {worstMonth.confidence}%
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <h4 className="font-bold text-yellow-800 mb-2">💰 Potencial de ganancia</h4>
        <div className="text-lg">
          <span className="font-bold text-green-600">+${potentialGain.toFixed(1)}</span>
          <span className="text-gray-600"> por {product.unit}</span>
          <span className="ml-2 font-bold text-green-600">(+{percentageGain}%)</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Esperando al mejor momento vs. vender en el peor momento
        </p>
      </div>
      
      {/* Botón para tokenizar */}
      {isVerifiedFarmer ? (
        <div className="mt-4">
          <button
            onClick={handleTokenize}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Package size={16} />
            Tokenizar mi {product.name}
          </button>
        </div>
      ) : (
        <div className="mt-4 text-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700">
            💡 Verifica tu cuenta de agricultor para tokenizar cosechas
          </p>
        </div>
      )}
    </div>
  );
};

export default OptimalTimingCard;