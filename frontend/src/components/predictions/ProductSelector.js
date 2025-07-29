// frontend/src/components/predictions/ProductSelector.js - VERSIÓN CORREGIDA
// ✅ CAMBIO PRINCIPAL: Usar getCurrentPrice en lugar de currentPriceUSD

import React from 'react';
import { getCurrentPrice } from '../../data/productData';

const ProductSelector = ({ products, selectedProduct, onProductSelect }) => {
  // Debug temporal
  console.log('=== DEBUG PRODUCT SELECTOR (FIXED) ===');
  console.log('products:', products);
  Object.entries(products).forEach(([key, product]) => {
    const currentPrice = getCurrentPrice(key);
    console.log(`${key}:`, {
      name: product.name,
      currentPrice: currentPrice,
      unit: product.unit,
      referencePrice: product.referencePrice
    });
  });

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Object.entries(products).map(([key, product]) => {
        // ✅ CORREGIDO: Usar getCurrentPrice en lugar de currentPriceUSD
        const currentPrice = getCurrentPrice(key);
        
        return (
          <button
            key={key}
            onClick={() => onProductSelect(key)}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              selectedProduct === key
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="text-3xl mb-2">{product.emoji}</div>
            <div className="font-bold text-lg">{product.name}</div>
            <div className="text-sm text-gray-600 mb-2">{product.description}</div>
            <div className="text-lg font-bold text-green-600">
              ${currentPrice.toFixed(2)}/{product.unit}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Rango: ${product.referencePrice?.min}-${product.referencePrice?.max}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ProductSelector;