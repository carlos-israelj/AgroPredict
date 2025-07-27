require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000001";
const SCROLLSCAN_API_KEY = process.env.SCROLLSCAN_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_RPC || "https://sepolia-rpc.scroll.io/",
      accounts: [PRIVATE_KEY],
      chainId: 534351,
      gasPrice: 1000000000, // 1 gwei
    },
    scroll: {
      url: process.env.SCROLL_MAINNET_RPC || "https://rpc.scroll.io/",
      accounts: [PRIVATE_KEY],
      chainId: 534352,
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: {
      scrollSepolia: SCROLLSCAN_API_KEY,
      scroll: SCROLLSCAN_API_KEY,
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com/",
        },
      },
      {
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com/",
        },
      },
    ],
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};