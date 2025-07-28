import React, { useState } from 'react';
import { Package, Plus } from 'lucide-react';
import TokenCard from './TokenCard';
import TokenizeModal from './TokenizeModal';

const MyTokensSystem = ({ tokens, isVerifiedFarmer, onCreateToken, stats }) => {
  const [showTokenizeModal, setShowTokenizeModal] = useState(false);

  // 🔧 DEBUG - Ver qué tokens llegan
  console.log('=== DEBUG MY TOKENS SYSTEM ===');
  console.log('tokens recibidos:', tokens);
  console.log('tokens.length:', tokens?.length);
  console.log('isVerifiedFarmer:', isVerifiedFarmer);

  // USAR SOLO TOKENS REALES DEL SMART CONTRACT
  const displayTokens = tokens || [];

  // Debug adicional
  console.log('displayTokens que se van a mostrar:', displayTokens);
  console.log('displayTokens.length:', displayTokens.length);

  const handleCreateToken = async (tokenData) => {
    const result = await onCreateToken(tokenData);
    if (result.success) {
      setShowTokenizeModal(false);
    }
    return result;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🌾 Mis Tokens de Cosecha</h2>
          <p className="text-gray-600">Gestiona tus cosechas tokenizadas</p>
        </div>
        
        {isVerifiedFarmer && (
          <button
            onClick={() => setShowTokenizeModal(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus size={20} />
            Crear Token
          </button>
        )}
      </div>

      {/* Beneficios de tokenizar */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-green-600 mb-2">💰</div>
          <h3 className="font-bold text-green-800">Liquidez Inmediata</h3>
          <p className="text-sm text-green-700">Recibe 70% del valor al crear el token</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-blue-600 mb-2">🛡️</div>
          <h3 className="font-bold text-blue-800">Precio Garantizado</h3>
          <p className="text-sm text-blue-700">Bloquea el precio futuro hoy mismo</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-purple-600 mb-2">🌐</div>
          <h3 className="font-bold text-purple-800">Sin Intermediarios</h3>
          <p className="text-sm text-purple-700">Vende directamente a compradores</p>
        </div>
      </div>
      
      {/* Lista de tokens */}
      {displayTokens.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No tienes tokens todavía</h3>
          <p className="text-gray-500">
            {isVerifiedFarmer 
              ? "Crea tu primer token haciendo clic en 'Crear Token'"
              : "Necesitas ser verificado como agricultor para crear tokens"
            }
          </p>
          
          {/* Debug info */}
          <div className="mt-4 text-xs text-gray-400">
            <p>Debug: tokens prop = {tokens ? `Array(${tokens.length})` : 'null/undefined'}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Info sobre tokens reales */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700">
              🌾 <strong>Tokens reales:</strong> Mostrando {displayTokens.length} token(s) de tu smart contract
            </p>
          </div>
          
          <div className="grid gap-4">
            {displayTokens.map(token => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        </div>
      )}

      {/* Modal de tokenización */}
      {showTokenizeModal && (
        <TokenizeModal
          onClose={() => setShowTokenizeModal(false)}
          onSubmit={handleCreateToken}
        />
      )}
    </div>
  );
};

export default MyTokensSystem;