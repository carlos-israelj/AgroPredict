import React from 'react';
import { MapPin, Calendar, Package, DollarSign, Star, Truck, User } from 'lucide-react';
import { productData } from '../../data/productData';

const TokenCard = ({ token }) => {
  // Debug para ver qué propiedades tiene el token
  console.log('=== DEBUG TOKEN CARD ===');
  console.log('token:', token);

  // CAMBIO: usar cropType directamente (ya está en mayúsculas)
  const cropType = token.cropType || 'CACAO';
  const productInfo = productData[cropType] || productData['CACAO']; // fallback a CACAO

  // Valores con fallbacks seguros
  const tokenId = token.id || 'N/A';
  const variety = token.variety || 'Estándar';
  const quantity = token.quantity || 0;
  const pricePerUnit = token.pricePerUnitUSD || token.pricePerUnit || 0;
  const totalPrice = token.totalPriceUSD || token.totalPrice || (quantity * pricePerUnit);
  const qualityGrade = token.qualityGrade || 'A';
  const deliveryDate = token.deliveryDate || 'No especificada';
  const location = token.location || 'No especificada';
  const createdAt = token.createdAt || 'Hoy';
  const organicCertified = token.organicCertified || false;
  const isSold = token.isSold || false;
  const isDelivered = token.isDelivered || false;
  const description = token.description || '';

  // Calcular días hasta entrega
  const deliveryTimestamp = token.deliveryTimestamp || new Date(token.deliveryDate).getTime() / 1000;
  const daysUntilDelivery = Math.ceil((deliveryTimestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24));

  // Determinar estado del token
  const getTokenStatus = () => {
    if (isDelivered) return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Entregado' };
    if (isSold) return { color: 'text-green-600', bg: 'bg-green-100', label: 'Vendido' };
    if (daysUntilDelivery <= 0) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Vencido' };
    return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Disponible' };
  };

  const tokenStatus = getTokenStatus();

  return (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Header del token */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{productInfo?.emoji || '🌾'}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                {cropType} - {variety}
                {organicCertified && (
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    🌱 Orgánico
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-600">Token #{tokenId}</p>
              <p className="text-xs text-gray-500">Creado: {createdAt}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${tokenStatus.bg} ${tokenStatus.color}`}>
              {tokenStatus.label}
            </span>
            {daysUntilDelivery > 0 && !isSold && (
              <p className="text-xs text-gray-500 mt-1">
                {daysUntilDelivery} días restantes
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Información principal en grid */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Cantidad */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Package size={16} className="mx-auto text-gray-600 mb-1" />
            <div className="font-bold text-lg text-gray-800">{quantity}</div>
            <div className="text-xs text-gray-600">{productInfo?.unit || 'unidades'}</div>
          </div>

          {/* Precio unitario */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <DollarSign size={16} className="mx-auto text-gray-600 mb-1" />
            <div className="font-bold text-lg text-gray-800">${pricePerUnit}</div>
            <div className="text-xs text-gray-600">por {productInfo?.unit}</div>
          </div>

          {/* Calidad */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Star size={16} className="mx-auto text-gray-600 mb-1" />
            <div className="font-bold text-lg text-gray-800">{qualityGrade}</div>
            <div className="text-xs text-gray-600">Calidad</div>
          </div>

          {/* Entrega */}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <Calendar size={16} className="mx-auto text-gray-600 mb-1" />
            <div className="font-bold text-sm text-gray-800">{deliveryDate}</div>
            <div className="text-xs text-gray-600">Entrega</div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <MapPin size={16} className="text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">{location}</span>
        </div>

        {/* Valor total destacado */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-700">Valor Total del Token</span>
            <span className="text-2xl font-bold text-green-600">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Desglose de pagos */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-xs text-green-700 mb-1">💰 Recibido al crear</div>
            <div className="font-bold text-green-600">${(totalPrice * 0.7).toLocaleString()}</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-xs text-blue-700 mb-1">🚚 Al entregar</div>
            <div className="font-bold text-blue-600">${(totalPrice * 0.3).toLocaleString()}</div>
          </div>
        </div>

        {/* Descripción si existe */}
        {description && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-600 font-medium">Descripción:</span>
            <p className="text-sm text-gray-700 mt-1">{description}</p>
          </div>
        )}

        {/* Información de comprador si está vendido */}
        {isSold && token.buyer && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User size={14} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Comprado por:</span>
            </div>
            <p className="text-xs font-mono text-gray-600">{token.buyer}</p>
            {isDelivered && (
              <div className="mt-2 flex items-center gap-1">
                <Truck size={12} className="text-green-600" />
                <span className="text-xs text-green-600 font-medium">Producto entregado</span>
              </div>
            )}
          </div>
        )}

        {/* Actions o status */}
        <div className="pt-2 border-t">
          {isSold && !isDelivered && (
            <div className="text-center p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                <Truck size={14} className="inline mr-1" />
                Pendiente de entrega - Coordina con el comprador
              </p>
            </div>
          )}
          
          {isDelivered && (
            <div className="text-center p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✅ Transacción completada - Gracias por usar AgroPredict
              </p>
            </div>
          )}
          
          {!isSold && daysUntilDelivery > 0 && (
            <div className="text-center p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                📢 Publicado en marketplace - Esperando compradores
              </p>
            </div>
          )}
          
          {!isSold && daysUntilDelivery <= 0 && (
            <div className="text-center p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                ⚠️ Token vencido - Fecha de entrega pasada
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenCard;