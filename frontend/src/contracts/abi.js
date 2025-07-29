// contracts/abi.js - ABI del contrato AgroPredict
export const AGROPREDICT_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"farmer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"}],"name":"CropDelivered","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"farmer","type":"address"},{"indexed":false,"internalType":"string","name":"cropType","type":"string"},{"indexed":false,"internalType":"uint256","name":"quantity","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"pricePerQuintal","type":"uint256"}],"name":"CropTokenMinted","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"totalPrice","type":"uint256"}],"name":"CropTokenSold","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"farmer","type":"address"}],"name":"FarmerVerified","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"cropType","type":"string"},{"indexed":false,"internalType":"uint256","name":"predictedPrice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"confidence","type":"uint256"}],"name":"PricePredictionUpdated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"buyCropToken","outputs":[],"stateMutability":"payable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"confirmDelivery","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"cropTokens","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"farmer","type":"address"},{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"uint256","name":"pricePerQuintal","type":"uint256"},{"internalType":"uint256","name":"deliveryDate","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"bool","name":"isDelivered","type":"bool"},{"internalType":"bool","name":"isSold","type":"bool"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"farmerTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getAvailableTokens","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getCropToken","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"address","name":"farmer","type":"address"},{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"uint256","name":"pricePerQuintal","type":"uint256"},{"internalType":"uint256","name":"deliveryDate","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"bool","name":"isDelivered","type":"bool"},{"internalType":"bool","name":"isSold","type":"bool"},{"internalType":"address","name":"buyer","type":"address"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"}],"internalType":"struct AgroPredict.CropToken","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"farmer","type":"address"}],"name":"getFarmerTokens","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"cropType","type":"string"}],"name":"getPrediction","outputs":[{"components":[{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"predictedPrice","type":"uint256"},{"internalType":"uint256","name":"confidence","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"targetDate","type":"uint256"}],"internalType":"struct AgroPredict.PricePrediction","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getStats","outputs":[{"internalType":"uint256","name":"totalTokens","type":"uint256"},{"internalType":"uint256","name":"availableTokens","type":"uint256"},{"internalType":"uint256","name":"soldTokens","type":"uint256"},{"internalType":"uint256","name":"totalVolume","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"latestPredictions","outputs":[{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"predictedPrice","type":"uint256"},{"internalType":"uint256","name":"confidence","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"uint256","name":"targetDate","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"uint256","name":"pricePerQuintal","type":"uint256"},{"internalType":"uint256","name":"deliveryDate","type":"uint256"},{"internalType":"string","name":"location","type":"string"},{"internalType":"string","name":"ipfsHash","type":"string"}],"name":"mintCropToken","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"platformFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"setPlatformFee","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"string","name":"cropType","type":"string"},{"internalType":"uint256","name":"predictedPrice","type":"uint256"},{"internalType":"uint256","name":"confidence","type":"uint256"},{"internalType":"uint256","name":"targetDate","type":"uint256"}],"name":"updatePricePrediction","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"verifiedFarmers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"farmer","type":"address"}],"name":"verifyFarmer","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"withdrawFees","outputs":[],"stateMutability":"nonpayable","type":"function"}
];

// Funciones específicas por categoría
export const CONTRACT_FUNCTIONS = {
  // Funciones de lectura
  READ: [
    'getAvailableTokens',
    'getCropToken',
    'getFarmerTokens',
    'getStats',
    'getPrediction',
    'verifiedFarmers',
    'balanceOf',
    'ownerOf',
    'platformFee'
  ],
  
  // Funciones de escritura
  WRITE: [
    'mintCropToken',
    'buyCropToken',
    'confirmDelivery',
    'verifyFarmer',
    'updatePricePrediction',
    'emergencyWithdraw',
    'setPlatformFee',
    'withdrawFees'
  ],
  
  // Eventos importantes
  EVENTS: [
    'CropTokenMinted',
    'CropTokenSold',
    'CropDelivered',
    'FarmerVerified',
    'PricePredictionUpdated'
  ]
};

console.log('📜 Contract ABI loaded with', AGROPREDICT_ABI.length, 'items');