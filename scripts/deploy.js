const { ethers } = require("hardhat");
const fs = require("fs-extra");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("🚀 Deploying AgroPredict MVP...");
  console.log("📍 Network:", network.name, "Chain ID:", network.chainId);
  console.log("👤 Deployer address:", deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH");
  
  // Deploy el contrato principal
  console.log("\n📦 Deploying AgroPredict contract...");
  const AgroPredict = await ethers.getContractFactory("AgroPredict");
  const agroPredict = await AgroPredict.deploy();
  await agroPredict.deployed();
  
  console.log("✅ AgroPredict deployed to:", agroPredict.address);
  console.log("⛽ Deployment gas used:", (await agroPredict.deployTransaction.wait()).gasUsed.toString());
  
  // Configuración inicial
  console.log("\n⚙️ Setting up initial configuration...");
  
  // Verificar al deployer como agricultor para testing
  if (process.env.CREATE_SAMPLE_TOKENS === "true") {
    console.log("👨‍🌾 Verifying deployer as farmer for testing...");
    const verifyTx = await agroPredict.verifyFarmer(deployer.address);
    await verifyTx.wait();
    console.log("✅ Deployer verified as farmer");
    
    // Crear predicciones de precios iniciales
    console.log("📊 Creating initial price predictions...");
    
    // Predicción para cacao ($140/quintal)
    const cacaoPrediction = await agroPredict.updatePricePrediction(
      "CACAO",
      ethers.utils.parseEther("140"), // $140 USD (usando ETH como proxy)
      85, // 85% confidence
      Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60) // 60 días
    );
    await cacaoPrediction.wait();
    
    // Predicción para banano ($25/quintal)
    const bananoPrediction = await agroPredict.updatePricePrediction(
      "BANANO",
      ethers.utils.parseEther("25"), // $25 USD
      78, // 78% confidence
      Math.floor(Date.now() / 1000) + (45 * 24 * 60 * 60) // 45 días
    );
    await bananoPrediction.wait();
    
    console.log("✅ Initial predictions created");
    
    // Crear tokens de muestra
    console.log("🌾 Creating sample crop tokens...");
    
    const sampleCacao = await agroPredict.mintCropToken(
      "CACAO",
      50, // 50 quintales
      ethers.utils.parseEther("140"), // $140/quintal
      Math.floor(Date.now() / 1000) + (120 * 24 * 60 * 60), // 120 días
      "Tenguel, Guayas",
      "QmSampleCacaoHash123"
    );
    await sampleCacao.wait();
    
    const sampleBanano = await agroPredict.mintCropToken(
      "BANANO",
      100, // 100 quintales
      ethers.utils.parseEther("25"), // $25/quintal
      Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60), // 90 días
      "Machala, El Oro",
      "QmSampleBananoHash456"
    );
    await sampleBanano.wait();
    
    console.log("✅ Sample tokens created");
  }
  
  // Guardar información del contrato
  const contractInfo = {
    network: network.name,
    chainId: network.chainId,
    address: agroPredict.address,
    deployer: deployer.address,
    deploymentHash: agroPredict.deployTransaction.hash,
    blockNumber: agroPredict.deployTransaction.blockNumber,
    timestamp: new Date().toISOString(),
    abi: JSON.parse(agroPredict.interface.format('json')),
    bytecode: AgroPredict.bytecode,
    platformFee: "250", // 2.5%
    supportedCrops: ["CACAO", "BANANO"],
    version: "1.0.0"
  };
  
  // Escribir archivo de información
  const infoPath = path.join(__dirname, "../contract-info.json");
  await fs.writeJson(infoPath, contractInfo, { spaces: 2 });
  
  console.log("\n📄 Contract info saved to:", infoPath);
  
  // Mostrar resumen del deployment
  console.log("\n🎉 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📍 Network: ${network.name} (${network.chainId})`);
  console.log(`📧 Contract: ${agroPredict.address}`);
  console.log(`👤 Owner: ${deployer.address}`);
  console.log(`⛽ Platform Fee: 2.5%`);
  console.log(`🌾 Sample Tokens: ${process.env.CREATE_SAMPLE_TOKENS === "true" ? "Created" : "Skipped"}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  // Verificación en explorer (solo en testnets/mainnet)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\n🔍 Verification info:");
    console.log("Run this command to verify the contract:");
    console.log(`npx hardhat verify --network ${network.name} ${agroPredict.address}`);
    
    if (network.name.includes("scroll")) {
      console.log(`🌐 View on Scrollscan: https://${network.name === "scrollSepolia" ? "sepolia." : ""}scrollscan.com/address/${agroPredict.address}`);
    }
  }
  
  // Comandos útiles
  console.log("\n🛠️ Useful commands:");
  console.log(`📊 Get stats: npx hardhat console --network ${network.name}`);
  console.log("    >> const contract = await ethers.getContractAt('AgroPredict', 'CONTRACT_ADDRESS')");
  console.log("    >> await contract.getStats()");
  console.log(`💰 Check balance: npx hardhat run scripts/check-balance.js --network ${network.name}`);
  
  return {
    contract: agroPredict,
    address: agroPredict.address,
    network: network.name,
    chainId: network.chainId
  };
}

// Ejecutar deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main;