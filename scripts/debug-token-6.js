// 🔍 Script para debuggear el Token ID 6 específico
// Crear archivo: scripts/debug-token-6.js

const { ethers } = require("hardhat");
const fs = require("fs-extra");
const path = require("path");

async function debugToken6() {
  console.log("🔍 === DEBUGGING TOKEN ID 6 CREATION ===");
  
  // Leer información del contrato
  const infoPath = path.join(__dirname, "../contract-info.json");
  const contractInfo = await fs.readJson(infoPath);
  const { address, abi } = contractInfo;
  
  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(address, abi, signer);
  
  console.log(`📧 Contract: ${address}`);
  console.log(`👤 Signer: ${signer.address}`);
  
  try {
    // Obtener el token ID 6
    const tokenId = 6;
    const tokenData = await contract.getCropToken(tokenId);
    
    console.log("\n📦 === TOKEN 6 RAW DATA FROM CONTRACT ===");
    console.log("Token ID:", tokenId);
    console.log("Farmer:", tokenData.farmer);
    console.log("Crop Type:", tokenData.cropType);
    console.log("Quantity:", tokenData.quantity.toString());
    console.log("Price Per Quintal (Wei):", tokenData.pricePerQuintal.toString());
    console.log("Price Per Quintal (ETH):", ethers.utils.formatEther(tokenData.pricePerQuintal));
    console.log("Delivery Date:", new Date(tokenData.deliveryDate.toNumber() * 1000).toLocaleDateString());
    console.log("Location:", tokenData.location);
    console.log("Created At:", new Date(tokenData.createdAt.toNumber() * 1000).toLocaleDateString());
    
    // Analizar qué precio se guardó
    const priceETH = parseFloat(ethers.utils.formatEther(tokenData.pricePerQuintal));
    const priceUSD = priceETH * 2500; // Conversión aproximada
    
    console.log("\n💰 === PRICE ANALYSIS ===");
    console.log("Price stored in contract (ETH):", priceETH);
    console.log("Price equivalent in USD (@ 2500 rate):", priceUSD);
    console.log("");
    console.log("EXPECTED if you entered $4:");
    console.log("- Should be stored as:", (4 / 2500).toFixed(6), "ETH");
    console.log("- Should show as:", "$4 USD");
    console.log("");
    console.log("ACTUAL stored:");
    console.log("- Actually stored as:", priceETH, "ETH"); 
    console.log("- Actually shows as:", "$" + priceUSD, "USD");
    console.log("");
    
    if (priceETH === 0.0016) {
      console.log("✅ CORRECT: Price matches $4 input");
    } else if (priceETH === 0.128) {
      console.log("❌ PROBLEM: Price shows $320 instead of $4");
      console.log("🔍 This suggests the conversion $4 -> ETH failed during creation");
    } else {
      console.log("🤷 UNKNOWN: Unexpected price value");
    }
    
    // Verificar eventos del contrato para este token
    console.log("\n📜 === CHECKING CREATION EVENT ===");
    const filter = contract.filters.CropTokenMinted(tokenId);
    const events = await contract.queryFilter(filter);
    
    if (events.length > 0) {
      const event = events[0];
      console.log("Event found:");
      console.log("- Block:", event.blockNumber);
      console.log("- Transaction:", event.transactionHash);
      console.log("- Farmer:", event.args.farmer);
      console.log("- Crop Type:", event.args.cropType);
      console.log("- Quantity:", event.args.quantity.toString());
      console.log("- Price (Wei):", event.args.pricePerQuintal.toString());
      console.log("- Price (ETH):", ethers.utils.formatEther(event.args.pricePerQuintal));
    } else {
      console.log("No creation event found for token", tokenId);
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

debugToken6()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });