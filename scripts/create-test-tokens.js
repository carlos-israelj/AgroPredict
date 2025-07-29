// scripts/create-test-tokens.js
const { ethers } = require("hardhat");

async function createTestTokens() {
    console.log("🌾 Creando tokens de prueba para AgroPredict...\n");
    
    // REEMPLAZA CON LA DIRECCIÓN DE TU CONTRATO
    const contractAddress = "0xD7381d1b015138Db3e43a4FF52Da6E09D6a19907"; // ← Pon aquí tu dirección del contrato
    
    /*if (contractAddress === "0xD7381d1b015138Db3e43a4FF52Da6E09D6a19907") {
        console.log("❌ DEBES REEMPLAZAR contractAddress CON LA DIRECCIÓN DE TU CONTRATO");
        return;
    }*/
    
    try {
        const [owner] = await ethers.getSigners();
        console.log("👨‍🌾 Agricultor/Owner:", owner.address);
        
        const AgroPredict = await ethers.getContractFactory("AgroPredict");
        const contract = AgroPredict.attach(contractAddress);
        
        // 1. Verificar si el agricultor está verificado
        console.log("🔍 Verificando status del agricultor...");
        const isVerified = await contract.verifiedFarmers(owner.address);
        console.log("✅ ¿Agricultor verificado?:", isVerified);
        
        if (!isVerified) {
            console.log("📋 Verificando agricultor...");
            const verifyTx = await contract.verifyFarmer(owner.address);
            await verifyTx.wait();
            console.log("✅ Agricultor verificado!");
        }
        
        // 2. Crear tokens de prueba
        const tokensToCreate = [
            {
                cropType: "CACAO",
                quantity: 50, // 50 quintales
                pricePerQuintal: ethers.utils.parseEther("0.001"), // 0.001 ETH por quintal
                deliveryDays: 60, // 60 días desde ahora
                location: "Tenguel, Guayas",
                ipfsHash: "QmTest1234567890"
            },
            {
                cropType: "BANANO",
                quantity: 100, // 100 quintales
                pricePerQuintal: ethers.utils.parseEther("0.0005"), // 0.0005 ETH por quintal
                deliveryDays: 45, // 45 días desde ahora
                location: "El Oro, Ecuador",
                ipfsHash: "QmTest0987654321"
            },
            {
                cropType: "CACAO",
                quantity: 25, // 25 quintales
                pricePerQuintal: ethers.utils.parseEther("0.002"), // 0.002 ETH por quintal (precio premium)
                deliveryDays: 90, // 90 días desde ahora
                location: "Manabí, Ecuador",
                ipfsHash: "QmTestPremium123"
            }
        ];
        
        console.log(`\n🚀 Creando ${tokensToCreate.length} tokens de prueba...\n`);
        
        for (let i = 0; i < tokensToCreate.length; i++) {
            const token = tokensToCreate[i];
            
            console.log(`📦 Creando token ${i + 1}:`);
            console.log(`  - Tipo: ${token.cropType}`);
            console.log(`  - Cantidad: ${token.quantity} quintales`);
            console.log(`  - Precio: ${ethers.utils.formatEther(token.pricePerQuintal)} ETH/quintal`);
            console.log(`  - Total: ${ethers.utils.formatEther(token.pricePerQuintal.mul(token.quantity))} ETH`);
            console.log(`  - Entrega: ${token.deliveryDays} días`);
            console.log(`  - Ubicación: ${token.location}`);
            
            // Calcular fecha de entrega
            const deliveryDate = Math.floor(Date.now() / 1000) + (token.deliveryDays * 24 * 60 * 60);
            
            try {
                const tx = await contract.mintCropToken(
                    token.cropType,
                    token.quantity,
                    token.pricePerQuintal,
                    deliveryDate,
                    token.location,
                    token.ipfsHash
                );
                
                console.log(`  ⏳ Transacción enviada: ${tx.hash}`);
                const receipt = await tx.wait();
                console.log(`  ✅ Token creado! Gas usado: ${receipt.gasUsed.toString()}`);
                
                // Obtener el ID del token desde el evento
                const event = receipt.events?.find(e => e.event === 'CropTokenMinted');
                if (event) {
                    console.log(`  🎯 Token ID: ${event.args.tokenId.toString()}`);
                }
                
            } catch (error) {
                console.log(`  ❌ Error creando token: ${error.message}`);
            }
            
            console.log("");
        }
        
        // 3. Verificar tokens creados
        console.log("📊 Verificando tokens disponibles...");
        const availableTokens = await contract.getAvailableTokens();
        console.log("✅ Tokens disponibles para comprar:", availableTokens.map(t => t.toString()));
        
        // 4. Mostrar estadísticas
        const stats = await contract.getStats();
        console.log("\n📈 Estadísticas del contrato:");
        console.log("  - Total tokens:", stats.totalTokens.toString());
        console.log("  - Tokens disponibles:", stats.availableTokens.toString());
        console.log("  - Tokens vendidos:", stats.soldTokens.toString());
        console.log("  - Volumen total:", ethers.utils.formatEther(stats.totalVolume), "ETH");
        
        console.log("\n🎉 ¡Tokens de prueba creados exitosamente!");
        console.log("💡 Ahora puedes ejecutar el script de debug para probar la compra:");
        console.log("npx hardhat run scripts/debug-purchase-fixed.js --network scrollSepolia");
        
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

// Ejecutar
createTestTokens()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });