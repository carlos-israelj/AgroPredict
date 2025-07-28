// 🔍 Script para debuggear el problema de precios

// PASO 1: Verificar qué precio tiene el token en el contrato
// Ejecutar en scripts/debug-token.js

const { ethers } = require("hardhat");
const fs = require("fs-extra");
const path = require("path");

async function debugToken() {
  console.log("🔍 === DEBUGGING TOKEN PRICES ===");
  
  // Leer información del contrato
  const infoPath = path.join(__dirname, "../contract-info.json");
  const contractInfo = await fs.readJson(infoPath);
  const { address, abi } = contractInfo;
  
  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(address, abi, signer);
  
  console.log(`📧 Contract: ${address}`);
  console.log(`👤 Signer: ${signer.address}`);
  
  // Obtener el token específico (probablemente token ID 5 basado en el error)
  const tokenId = 5; // Cambiar si es otro ID
  
  try {
    const tokenData = await contract.getCropToken(tokenId);
    
    console.log("\n📦 === TOKEN DATA FROM CONTRACT ===");
    console.log("Token ID:", tokenId);
    console.log("Farmer:", tokenData.farmer);
    console.log("Crop Type:", tokenData.cropType);
    console.log("Quantity:", tokenData.quantity.toString());
    console.log("Price Per Quintal (Wei):", tokenData.pricePerQuintal.toString());
    console.log("Price Per Quintal (ETH):", ethers.utils.formatEther(tokenData.pricePerQuintal));
    console.log("Delivery Date:", new Date(tokenData.deliveryDate.toNumber() * 1000).toLocaleDateString());
    console.log("Is Sold:", tokenData.isSold);
    console.log("Location:", tokenData.location);
    
    // Calcular precio total esperado
    const totalPriceWei = tokenData.quantity.mul(tokenData.pricePerQuintal);
    const totalPriceETH = ethers.utils.formatEther(totalPriceWei);
    
    console.log("\n💰 === PRICE CALCULATIONS ===");
    console.log("Total Price (Wei):", totalPriceWei.toString());
    console.log("Total Price (ETH):", totalPriceETH);
    console.log("Total Price (USD ~ 2500 rate):", (parseFloat(totalPriceETH) * 2500).toFixed(2));
    
    // Verificar qué precio enviaste
    const sentValueHex = "0x5d21dba00000";
    const sentValueWei = ethers.BigNumber.from(sentValueHex);
    const sentValueETH = ethers.utils.formatEther(sentValueWei);
    
    console.log("\n📤 === WHAT YOU SENT ===");
    console.log("Sent Value (Hex):", sentValueHex);
    console.log("Sent Value (Wei):", sentValueWei.toString());
    console.log("Sent Value (ETH):", sentValueETH);
    console.log("Sent Value (USD ~ 2500 rate):", (parseFloat(sentValueETH) * 2500).toFixed(2));
    
    console.log("\n🔍 === COMPARISON ===");
    console.log("Contract expects:", totalPriceETH, "ETH");
    console.log("You sent:", sentValueETH, "ETH");
    console.log("Difference:", (parseFloat(totalPriceETH) - parseFloat(sentValueETH)).toFixed(8), "ETH");
    console.log("Sufficient?", parseFloat(sentValueETH) >= parseFloat(totalPriceETH) ? "✅ YES" : "❌ NO");
    
  } catch (error) {
    console.error("❌ Error getting token data:", error.message);
  }
}

debugToken()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });