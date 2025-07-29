// scripts/debug-purchase-specific.js
const { ethers } = require("hardhat");

async function debugSpecificTokens() {
    console.log("🔍 Debug de compra para tokens específicos (12, 13, 14)...\n");
    
    const contractAddress = "0xD7381d1b015138Db3e43a4FF52Da6E09D6a19907";
    const targetTokens = [12, 13, 14]; // Los tokens que acabas de crear
    
    try {
        const [buyer] = await ethers.getSigners();
        console.log("💰 Comprador:", buyer.address);
        
        const balance = await buyer.getBalance();
        console.log("💰 Balance del comprador:", ethers.utils.formatEther(balance), "ETH\n");
        
        const AgroPredict = await ethers.getContractFactory("AgroPredict");
        const contract = AgroPredict.attach(contractAddress);
        
        console.log("🔗 Contrato:", contractAddress);
        console.log("🎯 Tokens objetivo:", targetTokens.join(", "), "\n");
        
        // Analizar cada token específico
        for (const tokenId of targetTokens) {
            console.log("=" .repeat(60));
            console.log(`🔍 ANALIZANDO TOKEN ${tokenId}`);
            console.log("=" .repeat(60));
            
            try {
                // Obtener detalles del token
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
                
                // Calcular precio total
                const totalPrice = tokenDetails.quantity.mul(tokenDetails.pricePerQuintal);
                console.log("\n💵 Precio total:", ethers.utils.formatEther(totalPrice), "ETH");
                
                // Verificar condiciones
                console.log("\n🔍 Verificando condiciones:");
                
                const isAvailable = !tokenDetails.isSold;
                console.log("  ✅ No vendido:", isAvailable);
                
                const now = Math.floor(Date.now() / 1000);
                const deliveryInFuture = tokenDetails.deliveryDate.toNumber() > now;
                console.log("  ✅ Entrega futura:", deliveryInFuture);
                
                const hasEnoughBalance = balance.gte(totalPrice);
                console.log("  ✅ Balance suficiente:", hasEnoughBalance);
                
                if (!isAvailable) {
                    console.log("  ❌ PROBLEMA: Token ya vendido");
                    continue;
                }
                
                if (!deliveryInFuture) {
                    console.log("  ❌ PROBLEMA: Fecha de entrega pasada");
                    continue;
                }
                
                if (!hasEnoughBalance) {
                    console.log("  ❌ PROBLEMA: Balance insuficiente");
                    console.log("    - Necesitas:", ethers.utils.formatEther(totalPrice), "ETH");
                    console.log("    - Tienes:", ethers.utils.formatEther(balance), "ETH");
                    continue;
                }
                
                // Estimar gas
                console.log("\n⛽ Estimando gas...");
                try {
                    const gasEstimate = await contract.estimateGas.buyCropToken(tokenId, {
                        value: totalPrice
                    });
                    console.log("✅ Gas estimado:", gasEstimate.toString());
                    
                    const gasPrice = await ethers.provider.getGasPrice();
                    const gasCost = gasEstimate.mul(gasPrice);
                    console.log("💰 Costo de gas:", ethers.utils.formatEther(gasCost), "ETH");
                    
                } catch (gasError) {
                    console.log("❌ Error estimando gas:");
                    console.log("  - Mensaje:", gasError.message);
                    if (gasError.reason) {
                        console.log("  - Razón:", gasError.reason);
                    }
                    continue;
                }
                
                // Simulación
                console.log("\n🧪 Simulando compra...");
                try {
                    await contract.callStatic.buyCropToken(tokenId, {
                        value: totalPrice
                    });
                    console.log("✅ Simulación exitosa");
                    
                } catch (simError) {
                    console.log("❌ Error en simulación:");
                    console.log("  - Mensaje:", simError.message);
                    if (simError.reason) {
                        console.log("  - Razón:", simError.reason);
                    }
                    continue;
                }
                
                // INTENTAR COMPRA REAL
                console.log("\n💳 INTENTANDO COMPRA REAL...");
                try {
                    const tx = await contract.buyCropToken(tokenId, {
                        value: totalPrice,
                        gasLimit: 350000 // Gas límite conservador
                    });
                    
                    console.log("✅ Transacción enviada:", tx.hash);
                    console.log("⏳ Esperando confirmación...");
                    
                    const receipt = await tx.wait();
                    console.log("🎉 ¡COMPRA EXITOSA!");
                    console.log("📊 Gas usado:", receipt.gasUsed.toString());
                    
                    // Verificar evento de compra
                    const saleEvent = receipt.events?.find(e => e.event === 'CropTokenSold');
                    if (saleEvent) {
                        console.log("📋 Evento de venta:");
                        console.log("  - Token ID:", saleEvent.args.tokenId.toString());
                        console.log("  - Comprador:", saleEvent.args.buyer);
                        console.log("  - Precio total:", ethers.utils.formatEther(saleEvent.args.totalPrice), "ETH");
                    }
                    
                    // Actualizar balance
                    const newBalance = await buyer.getBalance();
                    console.log("💰 Nuevo balance:", ethers.utils.formatEther(newBalance), "ETH");
                    console.log("💸 ETH gastado:", ethers.utils.formatEther(balance.sub(newBalance)), "ETH");
                    
                    break; // Solo comprar uno por ahora
                    
                } catch (purchaseError) {
                    console.log("❌ ERROR EN COMPRA REAL:");
                    console.log("  - Mensaje:", purchaseError.message);
                    console.log("  - Código:", purchaseError.code);
                    if (purchaseError.reason) {
                        console.log("  - Razón:", purchaseError.reason);
                    }
                    if (purchaseError.data) {
                        console.log("  - Data:", purchaseError.data);
                    }
                    
                    // Análisis de errores específicos
                    console.log("\n🔧 Análisis del error:");
                    if (purchaseError.message.includes("insufficient funds")) {
                        console.log("  💡 El wallet no tiene suficiente ETH");
                    } else if (purchaseError.message.includes("user rejected")) {
                        console.log("  💡 El usuario canceló la transacción");
                    } else if (purchaseError.message.includes("Token already sold")) {
                        console.log("  💡 Otro usuario compró el token mientras hacíamos debug");
                    } else if (purchaseError.message.includes("Delivery date passed")) {
                        console.log("  💡 La fecha de entrega pasó mientras hacíamos debug");
                    } else if (purchaseError.message.includes("Insufficient payment")) {
                        console.log("  💡 El valor enviado es menor al precio del token");
                    } else if (purchaseError.message.includes("execution reverted")) {
                        console.log("  💡 El contrato revirtió la transacción");
                        console.log("  💡 Posibles causas: condiciones del contrato no cumplidas");
                    } else {
                        console.log("  💡 Error desconocido - revisar logs completos");
                    }
                }
                
            } catch (tokenError) {
                console.log("❌ Error obteniendo token", tokenId, ":", tokenError.message);
            }
            
            console.log("\n");
        }
        
        // Estadísticas finales
        console.log("📊 ESTADÍSTICAS FINALES");
        console.log("=" .repeat(60));
        const stats = await contract.getStats();
        console.log("  - Total tokens:", stats.totalTokens.toString());
        console.log("  - Tokens disponibles:", stats.availableTokens.toString());
        console.log("  - Tokens vendidos:", stats.soldTokens.toString());
        console.log("  - Volumen total:", ethers.utils.formatEther(stats.totalVolume), "ETH");
        
        const availableTokens = await contract.getAvailableTokens();
        console.log("  - IDs disponibles:", availableTokens.map(t => t.toString()).join(", "));
        
    } catch (error) {
        console.error("❌ Error general:", error.message);
        console.error("Stack:", error.stack);
    }
}

// Ejecutar
debugSpecificTokens()
    .then(() => {
        console.log("\n✅ Debug completado");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Error fatal:", error);
        process.exit(1);
    });