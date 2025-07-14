// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AgroPredict {
    // Owner of the contract
    address public owner;
    
    // Supported crops
    enum Crop { CACAO, BANANA, COFFEE }
    
    // Price structure
    struct PriceData {
        uint256 price; // Price in cents USD
        uint256 timestamp;
    }
    
    // Order structure for marketplace
    struct Order {
        address farmer;
        Crop crop;
        uint256 quantity; // in kg
        uint256 pricePerKg; // in cents USD
        bool isSellOrder;
        bool isActive;
    }
    
    // Mappings
    mapping(Crop => PriceData[]) public priceHistory;
    mapping(Crop => uint256) public currentPrice;
    mapping(address => mapping(Crop => uint256)) public priceAlerts;
    
    // Orders
    Order[] public orders;
    mapping(address => uint256[]) public userOrders;
    
    // Events
    event PriceUpdated(Crop crop, uint256 price, uint256 timestamp);
    event AlertSet(address user, Crop crop, uint256 targetPrice);
    event AlertTriggered(address user, Crop crop, uint256 currentPrice);
    event OrderCreated(uint256 orderId, address farmer, Crop crop, uint256 quantity, uint256 price, bool isSellOrder);
    event OrderMatched(uint256 orderId, address buyer, address seller);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        
        // Initialize with some data (in production, this would come from oracles)
        currentPrice[Crop.CACAO] = 320; // $3.20 per kg
        currentPrice[Crop.BANANA] = 45;  // $0.45 per kg
        currentPrice[Crop.COFFEE] = 550; // $5.50 per kg
    }
    
    // Update price (in production, this would be called by Chainlink oracles)
    function updatePrice(Crop _crop, uint256 _price) external onlyOwner {
        currentPrice[_crop] = _price;
        priceHistory[_crop].push(PriceData(_price, block.timestamp));
        
        emit PriceUpdated(_crop, _price, block.timestamp);
        
        // Check alerts (basic implementation)
        // In production, this would be done off-chain for gas efficiency
    }
    
    // Get price prediction (MVP: simple 7-day moving average)
    function getPricePrediction(Crop _crop) external view returns (uint256) {
        PriceData[] memory history = priceHistory[_crop];
        if (history.length == 0) return currentPrice[_crop];
        
        uint256 sum = 0;
        uint256 count = 0;
        uint256 sevenDaysAgo = block.timestamp - 7 days;
        
        for (uint i = history.length; i > 0 && count < 7; i--) {
            if (history[i-1].timestamp >= sevenDaysAgo) {
                sum += history[i-1].price;
                count++;
            }
        }
        
        return count > 0 ? sum / count : currentPrice[_crop];
    }
    
    // Set price alert
    function setPriceAlert(Crop _crop, uint256 _targetPrice) external {
        priceAlerts[msg.sender][_crop] = _targetPrice;
        emit AlertSet(msg.sender, _crop, _targetPrice);
    }
    
    // Create order (simplified marketplace)
    function createOrder(
        Crop _crop,
        uint256 _quantity,
        uint256 _pricePerKg,
        bool _isSellOrder
    ) external {
        Order memory newOrder = Order({
            farmer: msg.sender,
            crop: _crop,
            quantity: _quantity,
            pricePerKg: _pricePerKg,
            isSellOrder: _isSellOrder,
            isActive: true
        });
        
        orders.push(newOrder);
        uint256 orderId = orders.length - 1;
        userOrders[msg.sender].push(orderId);
        
        emit OrderCreated(orderId, msg.sender, _crop, _quantity, _pricePerKg, _isSellOrder);
    }
    
    // Get active orders for a crop
    function getActiveOrders(Crop _crop, bool _sellOrders) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count active orders
        for (uint i = 0; i < orders.length; i++) {
            if (orders[i].isActive && 
                orders[i].crop == _crop && 
                orders[i].isSellOrder == _sellOrders) {
                count++;
            }
        }
        
        // Collect order IDs
        uint256[] memory activeOrders = new uint256[](count);
        uint256 index = 0;
        
        for (uint i = 0; i < orders.length; i++) {
            if (orders[i].isActive && 
                orders[i].crop == _crop && 
                orders[i].isSellOrder == _sellOrders) {
                activeOrders[index] = i;
                index++;
            }
        }
        
        return activeOrders;
    }
    
    // Cancel order
    function cancelOrder(uint256 _orderId) external {
        require(_orderId < orders.length, "Invalid order ID");
        require(orders[_orderId].farmer == msg.sender, "Not your order");
        require(orders[_orderId].isActive, "Order not active");
        
        orders[_orderId].isActive = false;
    }
    
    // Get historical prices
    function getPriceHistory(Crop _crop, uint256 _days) external view returns (PriceData[] memory) {
        PriceData[] memory history = priceHistory[_crop];
        if (history.length == 0) return history;
        
        uint256 startTime = block.timestamp - (_days * 1 days);
        uint256 count = 0;
        
        // Count relevant entries
        for (uint i = 0; i < history.length; i++) {
            if (history[i].timestamp >= startTime) count++;
        }
        
        // Create result array
        PriceData[] memory result = new PriceData[](count);
        uint256 index = 0;
        
        for (uint i = 0; i < history.length; i++) {
            if (history[i].timestamp >= startTime) {
                result[index] = history[i];
                index++;
            }
        }
        
        return result;
    }
    
    // Utility function to get crop name
    function getCropName(Crop _crop) external pure returns (string memory) {
        if (_crop == Crop.CACAO) return "Cacao";
        if (_crop == Crop.BANANA) return "Banana";
        if (_crop == Crop.COFFEE) return "Coffee";
        return "Unknown";
    }
}