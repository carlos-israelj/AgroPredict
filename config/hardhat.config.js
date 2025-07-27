require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            },
            viaIR: true // Habilitar IR para contratos grandes
        }
    },
    
    networks: {
        // Red local para desarrollo
        hardhat: {
            chainId: 31337,
            gas: 12000000,
            gasPrice: 1000000000,
            accounts: {
                mnemonic: "test test test test test test test test test test test junk",
                count: 10
            }
        },
        
        // Scroll Sepolia Testnet
        scrollSepolia: {
            url: process.env.SCROLL_SEPOLIA_RPC || "https://sepolia-rpc.scroll.io/",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 534351,
            gasPrice: 1000000000, // 1 gwei
            gas: 8000000,
            timeout: 120000,
            confirmations: 2
        },
        
        // Scroll Mainnet
        scroll: {
            url: process.env.SCROLL_MAINNET_RPC || "https://rpc.scroll.io/",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 534352,
            gasPrice: 1000000000, // 1 gwei
            gas: 8000000,
            timeout: 120000,
            confirmations: 3
        }
    },
    
    // Configuración para verificación de contratos
    etherscan: {
        apiKey: {
            scrollSepolia: process.env.SCROLLSCAN_API_KEY || "abc",
            scroll: process.env.SCROLLSCAN_API_KEY || "abc"
        },
        customChains: [
            {
                network: "scrollSepolia",
                chainId: 534351,
                urls: {
                    apiURL: "https://api-sepolia.scrollscan.com/api",
                    browserURL: "https://sepolia.scrollscan.com/"
                }
            },
            {
                network: "scroll",
                chainId: 534352,
                urls: {
                    apiURL: "https://api.scrollscan.com/api",
                    browserURL: "https://scrollscan.com/"
                }
            }
        ]
    },
    
    // Configuración del gas reporter
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
        gasPrice: 1, // en gwei
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    },
    
    // Configuración de paths
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    
    // Configuración del compilador
    mocha: {
        timeout: 120000
    },
    
    // Configuración de TypeScript (opcional)
    typechain: {
        outDir: "typechain-types",
        target: "ethers-v5"
    }
};