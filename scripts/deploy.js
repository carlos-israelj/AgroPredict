// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log("🚀 Desplegando AgroPredict en Scroll Sepolia Testnet...");
  
  // Obtener el deployer
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Desplegando con la cuenta:", deployer.address);
  
  // Verificar balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "ETH");
  
  if (balance === 0n) {
    console.error("❌ No tienes ETH en Scroll Sepolia. Necesitas obtener ETH de prueba!");
    console.log("🚰 Faucet: https://sepolia.scroll.io/bridge");
    process.exit(1);
  }

  // Deploy contract
  console.log("\n📄 Compilando y desplegando contrato...");
  const AgroPredict = await hre.ethers.getContractFactory("AgroPredict");
  const agroPredict = await AgroPredict.deploy();
  
  // Esperar confirmaciones
  console.log("⏳ Esperando confirmaciones...");
  await agroPredict.waitForDeployment();
  const address = await agroPredict.getAddress();
  
  console.log("✅ AgroPredict desplegado en:", address);
  console.log("🔍 Ver en explorer: https://sepolia.scrollscan.com/address/" + address);
  
  // Esperar un poco antes de inicializar
  console.log("\n⏱️  Esperando 30 segundos antes de inicializar...");
  await new Promise(resolve => setTimeout(resolve, 30000));
  
  // Inicializar con algunos datos de prueba
  console.log("\n📊 Agregando precios iniciales...");
  try {
    const tx1 = await agroPredict.updatePrice(0, 350, { gasLimit: 100000 });
    await tx1.wait();
    console.log("  ✓ Cacao: $3.50");
    
    const tx2 = await agroPredict.updatePrice(1, 48, { gasLimit: 100000 });
    await tx2.wait();
    console.log("  ✓ Banano: $0.48");
    
    const tx3 = await agroPredict.updatePrice(2, 580, { gasLimit: 100000 });
    await tx3.wait();
    console.log("  ✓ Café: $5.80");
  } catch (error) {
    console.log("⚠️  Error inicializando precios:", error.message);
  }

  // Guardar información para el frontend
  console.log("\n=================================");
  console.log("📝 INFORMACIÓN IMPORTANTE:");
  console.log("=================================");
  console.log(`Contract Address: ${address}`);
  console.log(`\nActualiza tu frontend (index.html):`);
  console.log(`const CONTRACT_ADDRESS = "${address}";`);
  console.log("\nNetwork: Scroll Sepolia Testnet");
  console.log("Chain ID: 534351");
  console.log("=================================\n");

  // Verificar contrato
  if (hre.network.name === "scrollSepolia") {
    console.log("📋 Para verificar el contrato, ejecuta:");
    console.log(`npx hardhat verify --network scrollSepolia ${address}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});