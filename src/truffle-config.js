const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          "42a8078df4f1fe49e1ba13f3629ea4fe4c12e0a931dd3640dcfd58f7fb33e4a7", // ⚠ Replace ASAP
          "https://eth-sepolia.g.alchemy.com/v2/BdczhLlBwIFSdqt_sdAaQj2nb9hEAEOC"
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
