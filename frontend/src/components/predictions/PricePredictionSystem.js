// frontend/src/components/predictions/PricePredictionSystem.js - VERSIÓN CORREGIDA
// ✅ CAMBIO PRINCIPAL: Usar getCurrentPrice en lugar de currentPriceUSD

import React, { useState } from 'react';
import { Search, Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';
import { 
  productData, 
  getProductBestMonth, 
  getProductWorstMonth,
  getCurrentPrice  // ✅ AGREGADO: Importar nueva función
} from '../../data/productData';
import ProductSelector from './ProductSelector';
import PriceChart from './PriceChart';
import SeasonalityCard from './SeasonalityCard';
import OptimalTimingCard from './OptimalTimingCard';

const PricePredictionSystem = ({ onTokenize, isVerifiedFarmer }) => {
  const [selectedProduct, setSelectedProduct] = useState('CACAO');
  
  const currentProduct = productData[selectedProduct];
  const bestMonth = getProductBestMonth(selectedProduct);
  const worstMonth = getProductWorstMonth(selectedProduct);

  // ✅ CORREGIDO: Usar getCurrentPrice en lugar de currentPriceUSD
  const currentPrice = getCurrentPrice(selectedProduct);
  const potentialGainFromNow = bestMonth ? (bestMonth.priceUSD - currentPrice) : 0;
  const percentageGainFromNow = currentPrice > 0 ? ((potentialGainFromNow / currentPrice) * 100).toFixed(1) : 0;

  // Debug temporal
  console.log('=== DEBUG PREDICTIONS FIXED ===');
  console.log('selectedProduct:', selectedProduct);
  console.log('currentProduct:', currentProduct);
  console.log('currentPrice (from getCurrentPrice):', currentPrice);
  console.log('bestMonth:', bestMonth);
  console.log('worstMonth:', worstMonth);
  console.log('potentialGainFromNow:', potentialGainFromNow);

  if (!currentProduct) {
    return (
      <div className="text-center p-8">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Producto no encontrado
        </h3>
        <p className="text-gray-600">
          Selecciona un producto válido para ver las predicciones
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con resumen ejecutivo */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Search size={24} />
          Predicciones Inteligentes de Precios
        </h2>
        <p className="text-green-100 mb-4">
          Sabe cuándo vender para maximizar tus ganancias
        </p>
        
        {bestMonth && currentPrice > 0 && (
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  +${potentialGainFromNow.toFixed(0)}
                </div>
                <div className="text-sm text-green-100">
                  por quintal esperando
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  +{percentageGainFromNow}%
                </div>
                <div className="text-sm text-green-100">
                  vs precio actual
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">
                  {bestMonth.month}
                </div>
                <div className="text-sm text-green-100">
                  mejor momento
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-green-600" />
          Selecciona tu Producto
        </h3>
        
        <ProductSelector
          products={productData}
          selectedProduct={selectedProduct}
          onProductSelect={setSelectedProduct}
        />
      </div>

      {/* Current Product Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          {currentProduct.emoji}
          Análisis de {currentProduct.name}
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold mb-2 text-blue-700">💰 Precio Actual</h4>
            <div className="text-3xl font-bold text-blue-600">
              ${currentPrice.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">
              por {currentProduct.unit}
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-bold mb-2 text-green-700">📈 Precio Máximo</h4>
            <div className="text-3xl font-bold text-green-600">
              ${bestMonth?.priceUSD.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-600">
              en {bestMonth?.month || 'N/A'}
            </div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-bold mb-2 text-yellow-700">💡 Ganancia Potencial</h4>
            <div className="text-3xl font-bold text-yellow-600">
              +${potentialGainFromNow.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">
              esperando al mejor momento
            </div>
          </div>
        </div>

        {/* Variedades disponibles */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold mb-2 text-gray-700">🌱 Variedades disponibles:</h4>
          <div className="flex flex-wrap gap-2">
            {currentProduct.varieties.map(variety => (
              <span 
                key={variety}
                className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
              >
                {variety}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Optimal Timing Strategy */}
      {bestMonth && worstMonth && (
        <OptimalTimingCard 
          product={currentProduct}
          bestMonth={bestMonth}
          worstMonth={worstMonth}
          onTokenize={onTokenize}
          isVerifiedFarmer={isVerifiedFarmer}
          selectedProduct={selectedProduct}
        />
      )}

      {/* Price Chart */}
      {currentProduct.predictions && (
        <PriceChart predictions={currentProduct.predictions} />
      )}

      {/* Seasonality */}
      <SeasonalityCard product={currentProduct} />

      {/* Insights */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Lightbulb size={20} className="text-orange-600" />
          Consejos de Expertos
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {currentProduct.insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="text-2xl flex-shrink-0">
                {insight.split(' ')[0]}
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  {insight.substring(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call-to-action bottom */}
      {isVerifiedFarmer && bestMonth && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-bold mb-2">
            🚀 ¿Listo para asegurar el mejor precio?
          </h3>
          <p className="text-green-100 mb-4">
            Tokeniza tu {currentProduct.name.toLowerCase()} ahora y véndelo automáticamente en {bestMonth.month} 
            cuando el precio llegue a ${bestMonth.priceUSD.toFixed(2)}/{currentProduct.unit}
          </p>
          <button
            onClick={() => onTokenize(selectedProduct)}
            className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-50 transition-colors shadow-lg"
          >
            Tokenizar mi {currentProduct.name} →
          </button>
        </div>
      )}

      {/* Footer informativo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-700 text-sm">
          <span className="font-semibold">💡 Dato importante:</span> Las predicciones se basan en análisis de mercado, 
          tendencias históricas y factores climáticos. La precisión promedio es del 85%.
        </p>
      </div>
    </div>
  );
};

export default PricePredictionSystem;