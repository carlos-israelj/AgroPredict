import React from 'react';
import { BarChart3 } from 'lucide-react';

const PriceChart = ({ predictions }) => {
  // CAMBIO PRINCIPAL: usar priceUSD en lugar de price
  const maxPrice = Math.max(...predictions.map(p => p.priceUSD));
  const minPrice = Math.min(...predictions.map(p => p.priceUSD));
  const priceRange = maxPrice - minPrice;

  // Debug temporal
  console.log('=== DEBUG PRICE CHART ===');
  console.log('predictions:', predictions);
  console.log('maxPrice:', maxPrice);
  console.log('minPrice:', minPrice);
  console.log('priceRange:', priceRange);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <BarChart3 size={20} className="text-blue-600" />
        Evolución de Precios - Próximos 12 Meses
      </h3>
      
      <div className="space-y-2">
        {predictions.map((pred, index) => {
          // CAMBIO: usar pred.priceUSD
          const barHeight = priceRange > 0 ? ((pred.priceUSD - minPrice) / priceRange) * 100 : 50;
          const isHighest = pred.priceUSD === maxPrice;
          const isLowest = pred.priceUSD === minPrice;
          
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-16 text-xs text-gray-600 font-medium">
                {pred.month}
              </div>
              
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    pred.trend === 'up' ? 'bg-green-500' : 'bg-red-400'
                  } ${isHighest ? 'bg-green-600' : ''} ${isLowest ? 'bg-red-500' : ''}`}
                  style={{ width: `${Math.max(barHeight, 10)}%` }}
                />
                
                <div className="absolute inset-0 flex items-center justify-between px-2">
                  <span className="text-xs font-bold text-white">
                    ${pred.priceUSD}
                  </span>
                  <span className="text-xs text-white">
                    {pred.confidence}%
                  </span>
                </div>
              </div>
              
              <div className="w-8 flex justify-center">
                {isHighest && <span className="text-green-600" title="Precio máximo">📈</span>}
                {isLowest && <span className="text-red-600" title="Precio mínimo">📉</span>}
                {pred.trend === 'up' && !isHighest && !isLowest && (
                  <span className="text-green-500" title="Tendencia alcista">↗️</span>
                )}
                {pred.trend === 'down' && !isHighest && !isLowest && (
                  <span className="text-red-500" title="Tendencia bajista">↘️</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 flex justify-between">
        <span>🟢 Tendencia alcista</span>
        <span>🔴 Tendencia bajista</span>
      </div>

      <div className="mt-2 text-xs text-gray-400 text-center">
        💡 Los porcentajes indican el nivel de confianza en la predicción
      </div>
    </div>
  );
};

export default PriceChart;