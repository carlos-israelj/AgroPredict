// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AgroPredict
 * @dev Smart contract para tokenización de cosechas futuras y predicciones de precios
 * @author AgroPredict Team
 */
contract AgroPredict is ERC721, Ownable, ReentrancyGuard {
    
    // Estructura para representar un token de cosecha
    struct CropToken {
        uint256 id;                    // ID único del token
        address farmer;                // Dirección del agricultor
        string cropType;               // Tipo de cultivo (CACAO, BANANO)
        uint256 quantity;              // Cantidad en quintales
        uint256 pricePerQuintal;       // Precio por quintal en wei
        uint256 deliveryDate;          // Fecha de entrega (timestamp)
        uint256 createdAt;             // Fecha de creación
        bool isDelivered;              // ¿Fue entregado?
        bool isSold;                   // ¿Fue vendido?
        address buyer;                 // Dirección del comprador
        string location;               // Ubicación de la finca
        string ipfsHash;               // Hash de metadata en IPFS
    }
    
    // Estructura para predicciones de precios
    struct PricePrediction {
        string cropType;               // Tipo de cultivo
        uint256 predictedPrice;        // Precio predicho en wei
        uint256 confidence;            // Nivel de confianza (0-100)
        uint256 timestamp;             // Cuándo se hizo la predicción
        uint256 targetDate;            // Para qué fecha es la predicción
    }
    
    // Mappings para almacenar datos
    mapping(uint256 => CropToken) public cropTokens;           // ID => Token
    mapping(string => PricePrediction) public latestPredictions; // Tipo => Predicción
    mapping(address => uint256[]) public farmerTokens;         // Agricultor => IDs de tokens
    mapping(address => bool) public verifiedFarmers;          // Agricultores verificados
    
    // Variables de estado
    uint256 private _tokenIdCounter;                           // Contador de tokens
    uint256 public platformFee = 250;                         // Comisión de plataforma (2.5%)
    
    // Eventos
    event CropTokenMinted(
        uint256 indexed tokenId,
        address indexed farmer,
        string cropType,
        uint256 quantity,
        uint256 pricePerQuintal
    );
    
    event CropTokenSold(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 totalPrice
    );
    
    event CropDelivered(
        uint256 indexed tokenId,
        address indexed farmer,
        address indexed buyer
    );
    
    event PricePredictionUpdated(
        string cropType,
        uint256 predictedPrice,
        uint256 confidence
    );
    
    event FarmerVerified(address indexed farmer);
    
    // Constructor
    constructor() ERC721("AgroPredict Crop Tokens", "AGRO") {}
    
    // Verificar agricultor (solo owner)
    function verifyFarmer(address farmer) external onlyOwner {
        verifiedFarmers[farmer] = true;
        emit FarmerVerified(farmer);
    }
    
    // Actualizar predicción de precios (solo owner)
    function updatePricePrediction(
        string memory cropType,
        uint256 predictedPrice,
        uint256 confidence,
        uint256 targetDate
    ) external onlyOwner {
        require(confidence <= 100, "Confidence must be <= 100");
        
        latestPredictions[cropType] = PricePrediction({
            cropType: cropType,
            predictedPrice: predictedPrice,
            confidence: confidence,
            timestamp: block.timestamp,
            targetDate: targetDate
        });
        
        emit PricePredictionUpdated(cropType, predictedPrice, confidence);
    }
    
    // Tokenizar cosecha futura
    function mintCropToken(
        string memory cropType,
        uint256 quantity,
        uint256 pricePerQuintal,
        uint256 deliveryDate,
        string memory location,
        string memory ipfsHash
    ) external {
        require(verifiedFarmers[msg.sender], "Farmer not verified");
        require(deliveryDate > block.timestamp, "Delivery date must be in future");
        require(quantity > 0, "Quantity must be positive");
        require(pricePerQuintal > 0, "Price must be positive");
        
        uint256 tokenId = _tokenIdCounter++;
        
        cropTokens[tokenId] = CropToken({
            id: tokenId,
            farmer: msg.sender,
            cropType: cropType,
            quantity: quantity,
            pricePerQuintal: pricePerQuintal,
            deliveryDate: deliveryDate,
            createdAt: block.timestamp,
            isDelivered: false,
            isSold: false,
            buyer: address(0),
            location: location,
            ipfsHash: ipfsHash
        });
        
        farmerTokens[msg.sender].push(tokenId);
        _mint(msg.sender, tokenId);
        
        emit CropTokenMinted(tokenId, msg.sender, cropType, quantity, pricePerQuintal);
    }
    
    // Comprar token de cosecha
    function buyCropToken(uint256 tokenId) external payable nonReentrant {
        CropToken storage token = cropTokens[tokenId];
        require(_exists(tokenId), "Token does not exist");
        require(!token.isSold, "Token already sold");
        require(token.deliveryDate > block.timestamp, "Delivery date passed");
        
        uint256 totalPrice = token.quantity * token.pricePerQuintal;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Calcular comisión de plataforma
        uint256 platformCommission = (totalPrice * platformFee) / 10000;
        uint256 farmerPayment = totalPrice - platformCommission;
        
        // Marcar como vendido
        token.isSold = true;
        token.buyer = msg.sender;
        
        // Transferir pagos
        payable(token.farmer).transfer(farmerPayment);
        
        // Devolver exceso si lo hay
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        emit CropTokenSold(tokenId, msg.sender, totalPrice);
    }
    
    // Confirmar entrega de cosecha
    function confirmDelivery(uint256 tokenId) external {
        CropToken storage token = cropTokens[tokenId];
        require(_exists(tokenId), "Token does not exist");
        require(token.isSold, "Token not sold yet");
        require(!token.isDelivered, "Already delivered");
        require(msg.sender == token.buyer || msg.sender == token.farmer, "Not authorized");
        
        token.isDelivered = true;
        
        emit CropDelivered(tokenId, token.farmer, token.buyer);
    }
    
    // Obtener tokens de un agricultor
    function getFarmerTokens(address farmer) external view returns (uint256[] memory) {
        return farmerTokens[farmer];
    }
    
    // Obtener detalles de un token
    function getCropToken(uint256 tokenId) external view returns (CropToken memory) {
        require(_exists(tokenId), "Token does not exist");
        return cropTokens[tokenId];
    }
    
    // Obtener predicción actual
    function getPrediction(string memory cropType) external view returns (PricePrediction memory) {
        return latestPredictions[cropType];
    }
    
    // Obtener tokens disponibles para comprar
    function getAvailableTokens() external view returns (uint256[] memory) {
        uint256[] memory availableTokens = new uint256[](_tokenIdCounter);
        uint256 count = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_exists(i) && !cropTokens[i].isSold && cropTokens[i].deliveryDate > block.timestamp) {
                availableTokens[count] = i;
                count++;
            }
        }
        
        // Redimensionar array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = availableTokens[i];
        }
        
        return result;
    }
    
    // Cambiar comisión de plataforma (solo owner)
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = newFee;
    }
    
    // Retirar fondos de comisiones (solo owner)
    function withdrawFees() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    // Función para emergencias - pausar contratos
    function emergencyWithdraw(uint256 tokenId) external {
        CropToken storage token = cropTokens[tokenId];
        require(msg.sender == token.farmer, "Not token owner");
        require(!token.isSold, "Token already sold");
        
        _burn(tokenId);
        delete cropTokens[tokenId];
        
        // Remover de array del agricultor
        uint256[] storage tokens = farmerTokens[msg.sender];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }
    
    // Obtener estadísticas generales
    function getStats() external view returns (
        uint256 totalTokens,
        uint256 availableTokens,
        uint256 soldTokens,
        uint256 totalVolume
    ) {
        totalTokens = _tokenIdCounter;
        availableTokens = 0;
        soldTokens = 0;
        totalVolume = 0;
        
        for (uint256 i = 0; i < _tokenIdCounter; i++) {
            if (_exists(i)) {
                CropToken memory token = cropTokens[i];
                if (token.isSold) {
                    soldTokens++;
                    totalVolume += token.quantity * token.pricePerQuintal;
                } else if (token.deliveryDate > block.timestamp) {
                    availableTokens++;
                }
            }
        }
    }
}