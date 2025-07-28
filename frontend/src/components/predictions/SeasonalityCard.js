import React from 'react';
import { Calendar } from 'lucide-react';

const SeasonalityCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <Calendar size={20} className="text-purple-600" />
        Estacionalidad y Planificación
      </h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-green-700 mb-2">🌟 Mejores meses para vender</h4>
          <div className="flex flex-wrap gap-2">
            {product.seasonality.best_months.map(month => (
              <span 
                key={month} 
                className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium"
              >
                {month}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-red-700 mb-2">⚠️ Meses a evitar</h4>
          <div className="flex flex-wrap gap-2">
            {product.seasonality.worst_months.map(month => (
              <span 
                key={month} 
                className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium"
              >
                {month}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-blue-700 mb-2">🌾 Temporada de cosecha</h4>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-medium">
            {product.seasonality.harvest_season}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeasonalityCard;