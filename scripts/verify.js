const { run } = require("hardhat");
const fs = require("fs-extra");
const path = require("path");

async function main() {
  console.log("🔍 Starting contract verification...");
  
  // Leer información del contrato deployado
  const infoPath = path.join(__dirname, "../contract-info.json");
  
  if (!fs.existsSync(infoPath)) {
    console.error("❌ contract-info.json not found. Deploy the contract first.");
    process.exit(1);
  }
  
  const contractInfo = await fs.readJson(infoPath);
  const { address, network } = contractInfo;
  
  console.log(`📍 Network: ${network}`);
  console.log(`📧 Contract Address: ${address}`);
  
  try {
    // Verificar el contrato
    await run("verify:verify", {
      address: address,
      constructorArguments: [], // AgroPredict no tiene argumentos de constructor
    });
    
    console.log("✅ Contract verified successfully!");
    
    // URLs del explorer según la red
    const explorerUrls = {
      scrollSepolia: `https://sepolia.scrollscan.com/address/${address}`,
      scroll: `https://scrollscan.com/address/${address}`,
    };
    
    if (explorerUrls[network]) {
      console.log(`🌐 View on explorer: ${explorerUrls[network]}`);
    }
    
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
      
      // Mostrar comandos de debug
      console.log("\n🛠️ Debug commands:");
      console.log(`npx hardhat flatten contracts/AgroPredict.sol > flattened.sol`);
      console.log("Then manually verify on the explorer with the flattened code");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });