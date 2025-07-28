import React from 'react';

const ProductSelector = ({ products, selectedProduct, onProductSelect }) => {
  // Debug temporal
  console.log('=== DEBUG PRODUCT SELECTOR ===');
  console.log('products:', products);
  Object.entries(products).forEach(([key, product]) => {
    console.log(`${key}:`, {
      currentPrice: product.currentPrice,
      currentPriceUSD: product.currentPriceUSD,
      unit: product.unit
    });
  });

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Object.entries(products).map(([key, product]) => (
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
            ${product.currentPriceUSD}/{product.unit}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ProductSelector;