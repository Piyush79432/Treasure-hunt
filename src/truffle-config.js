const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          "YOUR_WALLET_PRIVATE_KEY", // ⚠ Replace ASAP
          "https://eth-sepolia.g.alchemy.com/v2/Your_Alchemy_API_KEY"
        ),
      network_id: 11155111, // Sepolia network ID
      gas: 5000000,
      gasPrice: 10000000000, // 10 Gwei
    },
  },
  compilers: {
    solc: {
      version: "0.8.19", // Match your contract version
    },
  },
};
