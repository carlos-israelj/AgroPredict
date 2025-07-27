const { ethers } = require("hardhat");
const fs = require("fs-extra");
const path = require("path");

async function main() {
  console.log("🤝 AgroPredict Contract Interaction Script");
  console.log("==========================================");
  
  // Leer información del contrato
  const infoPath = path.join(__dirname, "../contract-info.json");
  
  if (!fs.existsSync(infoPath)) {
    console.error("❌ contract-info.json not found. Deploy the contract first.");
    process.exit(1);
  }
  
  const contractInfo = await fs.readJson(infoPath);
  const { address, abi } = contractInfo;
  
  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(address, abi, signer);
  
  console.log(`📍 Contract Address: ${address}`);
  console.log(`👤 Signer: ${signer.address}`);
  console.log(`💰 Balance: ${ethers.utils.formatEther(await signer.getBalance())} ETH\n`);
  
  try {
    // 1. Obtener estadísticas generales
    console.log("📊 Getting contract statistics...");
    const stats = await contract.getStats();
    console.log(`   Total Tokens: ${stats.totalTokens}`);
    console.log(`   Available: ${stats.availableTokens}`);
    console.log(`   Sold: ${stats.soldTokens}`);
    console.log(`   Total Volume: ${ethers.utils.formatEther(stats.totalVolume)} ETH\n`);
    
    // 2. Verificar si el signer es un agricultor verificado
    console.log("👨‍🌾 Checking farmer verification...");
    const isVerified = await contract.verifiedFarmers(signer.address);
    console.log(`   Is Verified Farmer: ${isVerified}\n`);
    
    // 3. Si no está verificado, verificarlo (solo si es el owner)
    if (!isVerified) {
      try {
        console.log("🔐 Verifying farmer...");
        const verifyTx = await contract.verifyFarmer(signer.address);
        await verifyTx.wait();
        console.log("✅ Farmer verified successfully!\n");
      } catch (error) {
        console.log("⚠️ Could not verify farmer (might not be owner)\n");
      }
    }
    
    // 4. Obtener predicciones actuales
    console.log("🔮 Getting price predictions...");
    try {
      const cacaoPrediction = await contract.getPrediction("CACAO");
      if (cacaoPrediction.timestamp > 0) {
        console.log(`   CACAO: $${ethers.utils.formatEther(cacaoPrediction.predictedPrice)} (${cacaoPrediction.confidence}% confidence)`);
      } else {
        console.log("   CACAO: No prediction available");
      }
      
      const bananoPrediction = await contract.getPrediction("BANANO");
      if (bananoPrediction.timestamp > 0) {
        console.log(`   BANANO: $${ethers.utils.formatEther(bananoPrediction.predictedPrice)} (${bananoPrediction.confidence}% confidence)`);
      } else {
        console.log("   BANANO: No prediction available");
      }
    } catch (error) {
      console.log("   Could not fetch predictions");
    }
    console.log();
    
    // 5. Obtener tokens disponibles en el marketplace
    console.log("🛒 Getting available tokens...");
    const availableTokens = await contract.getAvailableTokens();
    console.log(`   Found ${availableTokens.length} available tokens:`);
    
    for (let i = 0; i < Math.min(availableTokens.length, 5); i++) {
      const tokenId = availableTokens[i];
      const token = await contract.getCropToken(tokenId);
      const totalPrice = token.quantity.mul(token.pricePerQuintal);
      
      console.log(`   Token #${tokenId}:`);
      console.log(`     Crop: ${token.cropType}`);
      console.log(`     Quantity: ${token.quantity} quintales`);
      console.log(`     Price: $${ethers.utils.formatEther(token.pricePerQuintal)}/quintal`);
      console.log(`     Total: $${ethers.utils.formatEther(totalPrice)}`);
      console.log(`     Location: ${token.location}`);
      console.log(`     Delivery: ${new Date(token.deliveryDate.toNumber() * 1000).toLocaleDateString()}`);
      console.log();
    }
    
    if (availableTokens.length > 5) {
      console.log(`   ... and ${availableTokens.length - 5} more tokens\n`);
    }
    
    // 6. Obtener tokens del signer
    console.log("🌾 Getting your tokens...");
    const myTokens = await contract.getFarmerTokens(signer.address);
    console.log(`   You have ${myTokens.length} tokens:`);
    
    for (let i = 0; i < myTokens.length; i++) {
      const tokenId = myTokens[i];
      const token = await contract.getCropToken(tokenId);
      const totalPrice = token.quantity.mul(token.pricePerQuintal);
      
      console.log(`   Token #${tokenId}:`);
      console.log(`     Crop: ${token.cropType}`);
      console.log(`     Quantity: ${token.quantity} quintales`);
      console.log(`     Total Value: $${ethers.utils.formatEther(totalPrice)}`);
      console.log(`     Status: ${token.isSold ? 'Sold' : 'Available'}`);
      if (token.isSold) {
        console.log(`     Buyer: ${token.buyer}`);
      }
      console.log();
    }
    
    // 7. Mostrar comisión de plataforma
    const platformFee = await contract.platformFee();
    console.log(`💳 Platform fee: ${platformFee / 100}%`);
    
    // 8. Mostrar balance del contrato
    const contractBalance = await ethers.provider.getBalance(address);
    console.log(`💰 Contract balance: ${ethers.utils.formatEther(contractBalance)} ETH`);
    
  } catch (error) {
    console.error("❌ Error interacting with contract:", error.message);
  }
  
  console.log("\n🛠️ Useful commands:");
  console.log("To create a new prediction:");
  console.log(`await contract.updatePricePrediction("CACAO", ethers.utils.parseEther("150"), 90, ${Math.floor(Date.now() / 1000) + 86400})`);
  console.log("\nTo create a new token:");
  console.log(`await contract.mintCropToken("CACAO", 50, ethers.utils.parseEther("140"), ${Math.floor(Date.now() / 1000) + 86400 * 90}, "Your Location", "ipfsHash")`);
  console.log("\nTo buy a token:");
  console.log(`await contract.buyCropToken(tokenId, { value: ethers.utils.parseEther("7000") })`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });