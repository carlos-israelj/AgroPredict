// scripts/debug-purchase-fixed.js
const { ethers } = require("hardhat");

async function debugPurchase() {
    console.log("🔍 Iniciando debug de compra de tokens...\n");
    
    // REEMPLAZA ESTA DIRECCIÓN CON LA DE TU CONTRATO DESPLEGADO
    const contractAddress = "0xD7381d1b015138Db3e43a4FF52Da6E09D6a19907"; // ← Pon aquí tu dirección del contrato
    
    if (contractAddress === "0xD7381d1b015138Db3e43a4FF52Da6E09D6a19907") {
        console.log("❌ DEBES REEMPLAZAR contractAddress CON LA DIRECCIÓN DE TU CONTRATO");
        console.log("💡 Busca en tus logs de deploy o en scrollscan.com");
        return;
    }
    
    try {
        // Obtener signers directamente
        const [buyer] = await ethers.getSigners();
        console.log("💰 Comprador:", buyer.address);
        
        // Verificar balance
        const balance = await buyer.getBalance();
        console.log("💰 Balance del comprador:", ethers.utils.formatEther(balance), "ETH\n");
        
        // Obtener el contrato
        console.log("🔗 Conectando al contrato en:", contractAddress);
        const AgroPredict = await ethers.getContractFactory("AgroPredict");
        const contract = AgroPredict.attach(contractAddress);
        
        // Verificar que el contrato existe
        console.log("🔍 Verificando contrato...");
        const code = await ethers.provider.getCode(contractAddress);
        if (code === "0x") {
            console.log("❌ No hay contrato en esa dirección");
            return;
        }
        console.log("✅ Contrato encontrado\n");
        
        // 1. Verificar tokens disponibles
        console.log("📋 Obteniendo tokens disponibles...");
        const availableTokens = await contract.getAvailableTokens();
        console.log("✅ Tokens disponibles:", availableTokens.map(t => t.toString()));
        
        if (availableTokens.length === 0) {
            console.log("❌ No hay tokens disponibles para comprar");
            console.log("💡 Necesitas crear tokens primero con mintCropToken()");
            return;
        }
        
        const tokenId = availableTokens[0];
        console.log("🎯 Analizando token ID:", tokenId.toString(), "\n");
        
        // 2. Obtener detalles del token
        console.log("📊 Obteniendo detalles del token...");
        const tokenDetails = await contract.getCropToken(tokenId);
        
        console.log("📋 Detalles del token:");
        console.log("  - ID:", tokenDetails.id.toString());
        console.log("  - Agricultor:", tokenDetails.farmer);
        console.log("  - Tipo:", tokenDetails.cropType);
        console.log("  - Cantidad:", tokenDetails.quantity.toString(), "quintales");
        console.log("  - Precio por quintal:", ethers.utils.formatEther(tokenDetails.pricePerQuintal), "ETH");
        console.log("  - Fecha entrega:", new Date(tokenDetails.deliveryDate.toNumber() * 1000));
        console.log("  - ¿Vendido?:", tokenDetails.isSold);
        console.log("  - ¿Entregado?:", tokenDetails.isDelivered);
        console.log("  - Comprador:", tokenDetails.buyer);
        
        // 3. Calcular precio total
        const totalPrice = tokenDetails.quantity.mul(tokenDetails.pricePerQuintal);
        console.log("\n💵 Cálculos de precio:");
        console.log("  - Precio por quintal:", ethers.utils.formatEther(tokenDetails.pricePerQuintal), "ETH");
        console.log("  - Cantidad:", tokenDetails.quantity.toString(), "quintales");
        console.log("  - Precio total:", ethers.utils.formatEther(totalPrice), "ETH");
        
        // 4. Verificar condiciones previas
        console.log("\n🔍 Verificando condiciones de compra...");
        
        // Verificar si ya está vendido
        console.log("  ✅ Token no vendido:", !tokenDetails.isSold);
        if (tokenDetails.isSold) {
            console.log("  ❌ PROBLEMA: Token ya está vendido");
            return;
        }
        
        // Verificar fecha de entrega
        const now = Math.floor(Date.now() / 1000);
        const deliveryInFuture = tokenDetails.deliveryDate.toNumber() > now;
        console.log("  ✅ Fecha de entrega futura:", deliveryInFuture);
        if (!deliveryInFuture) {
            console.log("  ❌ PROBLEMA: Fecha de entrega ya pasó");
            console.log("    - Ahora:", new Date(now * 1000));
            console.log("    - Entrega:", new Date(tokenDetails.deliveryDate.toNumber() * 1000));
            return;
        }
        
        // Verificar balance suficiente
        const hasEnoughBalance = balance.gte(totalPrice);
        console.log("  ✅ Balance suficiente:", hasEnoughBalance);
        if (!hasEnoughBalance) {
            console.log("  ❌ PROBLEMA: Balance insuficiente");
            console.log("    - Tu balance:", ethers.utils.formatEther(balance), "ETH");
            console.log("    - Necesitas:", ethers.utils.formatEther(totalPrice), "ETH");
            console.log("    - Faltan:", ethers.utils.formatEther(totalPrice.sub(balance)), "ETH");
            return;
        }
        
        // 5. Estimar gas
        console.log("\n⛽ Estimando gas...");
        try {
            const gasEstimate = await contract.estimateGas.buyCropToken(tokenId, {
                value: totalPrice
            });
            console.log("✅ Gas estimado:", gasEstimate.toString());
            
            // Calcular costo de gas
            const gasPrice = await ethers.provider.getGasPrice();
            const gasCost = gasEstimate.mul(gasPrice);
            console.log("💰 Costo de gas:", ethers.utils.formatEther(gasCost), "ETH");
            console.log("💰 Costo total (precio + gas):", ethers.utils.formatEther(totalPrice.add(gasCost)), "ETH");
            
            // Verificar si tiene suficiente para gas también
            const totalCost = totalPrice.add(gasCost);
            if (balance.lt(totalCost)) {
                console.log("❌ PROBLEMA: Balance insuficiente incluyendo gas");
                console.log("    - Necesitas total:", ethers.utils.formatEther(totalCost), "ETH");
                return;
            }
            
        } catch (gasError) {
            console.log("❌ Error estimando gas:");
            console.log("  - Mensaje:", gasError.message);
            if (gasError.reason) {
                console.log("  - Razón:", gasError.reason);
            }
            
            // Analizar errores específicos
            if (gasError.message.includes("Token already sold")) {
                console.log("  💡 El token fue vendido mientras hacíamos el debug");
            } else if (gasError.message.includes("Delivery date passed")) {
                console.log("  💡 La fecha de entrega pasó mientras hacíamos el debug");
            } else if (gasError.message.includes("Insufficient payment")) {
                console.log("  💡 El cálculo de precio es incorrecto");
            }
            return;
        }
        
        // 6. Intentar compra simulada (sin enviar transacción real)
        console.log("\n🧪 Simulando compra...");
        try {
            // callStatic simula la transacción sin ejecutarla
            await contract.callStatic.buyCropToken(tokenId, {
                value: totalPrice
            });
            console.log("✅ Simulación exitosa - La compra debería funcionar");
            
        } catch (simulationError) {
            console.log("❌ Error en simulación:");
            console.log("  - Mensaje:", simulationError.message);
            if (simulationError.reason) {
                console.log("  - Razón:", simulationError.reason);
            }
            
            // Decodificar error específico
            if (simulationError.data) {
                console.log("  - Data:", simulationError.data);
            }
        }
        
        console.log("\n📋 RESUMEN:");
        console.log("=".repeat(50));
        console.log("Token ID:", tokenId.toString());
        console.log("Precio total:", ethers.utils.formatEther(totalPrice), "ETH");
        console.log("Tu balance:", ethers.utils.formatEther(balance), "ETH");
        console.log("Estado:", !tokenDetails.isSold ? "Disponible" : "Vendido");
        console.log("Fecha entrega:", new Date(tokenDetails.deliveryDate.toNumber() * 1000));
        
    } catch (error) {
        console.log("❌ Error general:", error.message);
        console.log("Stack:", error.stack);
    }
}

async function checkNetworkInfo() {
    console.log("🌐 Información de red:");
    const network = await ethers.provider.getNetwork();
    console.log("  - Chain ID:", network.chainId);
    console.log("  - Nombre:", network.name);
    
    const block = await ethers.provider.getBlockNumber();
    console.log("  - Bloque actual:", block);
    
    const gasPrice = await ethers.provider.getGasPrice();
    console.log("  - Gas price:", ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
}

// Función principal
async function main() {
    console.log("🚀 Script de Debug Mejorado para AgroPredict\n");
    
    await checkNetworkInfo();
    console.log("\n" + "=".repeat(60) + "\n");
    await debugPurchase();
}

// Ejecutar
main()
    .then(() => {
        console.log("\n✅ Debug completado");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Error fatal:", error);
        process.exit(1);
    });