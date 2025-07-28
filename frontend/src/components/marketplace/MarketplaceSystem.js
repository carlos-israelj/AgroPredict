import React from 'react';
import { DollarSign } from 'lucide-react';
import MarketTokenCard from './MarketTokenCard';

const MarketplaceSystem = ({ tokens, currentAccount, currentBalance, onBuyToken, stats }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🛒 Marketplace</h2>
        <p className="text-gray-600">Compra cosechas futuras de otros agricultores</p>
      </div>

      {/* Estadísticas del marketplace */}
      {stats && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold mb-3">📊 Estadísticas del Marketplace</h3>
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
              <div className="text-2xl font-bold text-orange-600">${stats.totalVolume?.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Volumen Total</div>
            </div>
          </div>
        </div>
      )}
      
      {tokens.length === 0 ? (
        <div className="text-center py-12">
          <DollarSign className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No hay tokens disponibles</h3>
          <p className="text-gray-500">
            Los tokens aparecerán aquí cuando los agricultores los publiquen
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map(token => (
            <MarketTokenCard
              key={token.id}
              token={token}
              currentAccount={currentAccount}
              currentBalance={currentBalance}
              onBuy={onBuyToken}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplaceSystem;