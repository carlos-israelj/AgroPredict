// Script de debug para identificar el problema en buyCropToken
// Archivo: scripts/debug-purchase.js

const { ethers } = require("hardhat");

async function debugPurchase() {
    console.log("🔍 Iniciando debug de compra de tokens...\n");
    
    // Obtener el contrato desplegado
    const contractAddress = "TU_CONTRACT_ADDRESS_AQUI"; // Reemplaza con tu dirección
    const AgroPredict = await ethers.getContractFactory("AgroPredict");
    const contract = AgroPredict.attach(contractAddress);
    
    const [buyer] = await ethers.getSigners();
    console.log("💰 Comprador:", buyer.address);
    console.log("💰 Balance del comprador:", ethers.utils.formatEther(await buyer.getBalance()), "ETH\n");
    
    try {
        // 1. Verificar tokens disponibles
        console.log("📋 Obteniendo tokens disponibles...");
        const availableTokens = await contract.getAvailableTokens();
        console.log("✅ Tokens disponibles:", availableTokens.toString());
        
        if (availableTokens.length === 0) {
            console.log("❌ No hay tokens disponibles para comprar");
            return;
        }
        
        const tokenId = availableTokens[0];
        console.log("🎯 Intentando comprar token ID:", tokenId.toString(), "\n");
        
        // 2. Obtener detalles del token
        console.log("📊 Obteniendo detalles del token...");
        const tokenDetails = await contract.getCropToken(tokenId);
        
        console.log("📋 Detalles del token:");
        console.log("  - Agricultor:", tokenDetails.farmer);
        console.log("  - Tipo:", tokenDetails.cropType);
        console.log("  - Cantidad:", tokenDetails.quantity.toString(), "quintales");
        console.log("  - Precio por quintal:", ethers.utils.formatEther(tokenDetails.pricePerQuintal), "ETH");
        console.log("  - Fecha entrega:", new Date(tokenDetails.deliveryDate.toNumber() * 1000));
        console.log("  - ¿Vendido?:", tokenDetails.isSold);
        console.log("  - ¿Entregado?:", tokenDetails.isDelivered);
        
        // 3. Calcular precio total
        const totalPrice = tokenDetails.quantity.mul(tokenDetails.pricePerQuintal);
        console.log("💵 Precio total:", ethers.utils.formatEther(totalPrice), "ETH");
        
        // 4. Verificar condiciones previas
        console.log("\n🔍 Verificando condiciones...");
        
        // Verificar si el token existe
        const exists = await contract.ownerOf(tokenId).catch(() => false);
        console.log("  ✅ Token existe:", !!exists);
        
        // Verificar si ya está vendido
        console.log("  ✅ Token no vendido:", !tokenDetails.isSold);
        
        // Verificar fecha de entrega
        const now = Math.floor(Date.now() / 1000);
        const deliveryInFuture = tokenDetails.deliveryDate.toNumber() > now;
        console.log("  ✅ Fecha de entrega futura:", deliveryInFuture);
        
        // Verificar balance suficiente
        const buyerBalance = await buyer.getBalance();
        const hasEnoughBalance = buyerBalance.gte(totalPrice);
        console.log("  ✅ Balance suficiente:", hasEnoughBalance);
        
        if (!hasEnoughBalance) {
            console.log("❌ Balance insuficiente. Necesitas:", ethers.utils.formatEther(totalPrice), "ETH");
            return;
        }
        
        // 5. Estimar gas
        console.log("\n⛽ Estimando gas...");
        try {
            const gasEstimate = await contract.estimateGas.buyCropToken(tokenId, {
                value: totalPrice
            });
            console.log("✅ Gas estimado:", gasEstimate.toString());
        } catch (gasError) {
            console.log("❌ Error estimando gas:", gasError.message);
            
            // Intentar con más valor para debug
            try {
                const gasEstimateHigher = await contract.estimateGas.buyCropToken(tokenId, {
                    value: totalPrice.mul(110).div(100) // 10% más
                });
                console.log("✅ Gas estimado con 10% extra:", gasEstimateHigher.toString());
            } catch (gasError2) {
                console.log("❌ Error persistente estimando gas:", gasError2.message);
            }
        }
        
        // 6. Intentar la compra con try-catch detallado
        console.log("\n💳 Intentando compra...");
        try {
            const tx = await contract.buyCropToken(tokenId, {
                value: totalPrice,
                gasLimit: 300000 // Gas límite manual
            });
            
            console.log("✅ Transacción enviada:", tx.hash);
            console.log("⏳ Esperando confirmación...");
            
            const receipt = await tx.wait();
            console.log("✅ Compra exitosa!");
            console.log("📊 Gas usado:", receipt.gasUsed.toString());
            
        } catch (purchaseError) {
            console.log("❌ Error en la compra:");
            console.log("  - Mensaje:", purchaseError.message);
            console.log("  - Razón:", purchaseError.reason);
            console.log("  - Código:", purchaseError.code);
            
            // Decodificar error si es posible
            if (purchaseError.data) {
                console.log("  - Data:", purchaseError.data);
            }
            
            // Errores comunes y sus soluciones
            console.log("\n🔧 Posibles causas:");
            if (purchaseError.message.includes("insufficient funds")) {
                console.log("  💰 Balance insuficiente");
            }
            if (purchaseError.message.includes("Token already sold")) {
                console.log("  🚫 Token ya vendido");
            }
            if (purchaseError.message.includes("Delivery date passed")) {
                console.log("  📅 Fecha de entrega pasada");
            }
            if (purchaseError.message.includes("Insufficient payment")) {
                console.log("  💵 Pago insuficiente");
            }
            if (purchaseError.message.includes("Token does not exist")) {
                console.log("  🚫 Token no existe");
            }
        }
        
    } catch (error) {
        console.log("❌ Error general:", error.message);
    }
}

async function checkContractState() {
    console.log("\n📊 Verificando estado del contrato...");
    
    const contractAddress = "TU_CONTRACT_ADDRESS_AQUI";
    const AgroPredict = await ethers.getContractFactory("AgroPredict");
    const contract = AgroPredict.attach(contractAddress);
    
    try {
        // Estadísticas generales
        const stats = await contract.getStats();
        console.log("📈 Estadísticas:");
        console.log("  - Total tokens:", stats.totalTokens.toString());
        console.log("  - Tokens disponibles:", stats.availableTokens.toString());
        console.log("  - Tokens vendidos:", stats.soldTokens.toString());
        console.log("  - Volumen total:", ethers.utils.formatEther(stats.totalVolume), "ETH");
        
        // Comisión de plataforma
        const platformFee = await contract.platformFee();
        console.log("  - Comisión plataforma:", platformFee.toString() / 100, "%");
        
        // Owner del contrato
        const owner = await contract.owner();
        console.log("  - Owner:", owner);
        
    } catch (error) {
        console.log("❌ Error obteniendo estado:", error.message);
    }
}

// Función principal
async function main() {
    await checkContractState();
    await debugPurchase();
}

// Ejecutar si es llamado directamente
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

module.exports = { debugPurchase, checkContractState };