window.TreasureHuntConfig = {
  // You can update this value in production without rebuilding the app
  CONTRACT_ADDRESS: "0x0881Ba8e0ac771359aFf201C00d06202aCe009b7", // Replace with deployed contract

  // Network configuration
  NETWORK_ID: "11155111", // Sepolia Testnet (change this if using another network)

  // Game configuration
  JOIN_FEE: "0.05",
   // Lowered to reduce gas fees for testing

  // UI configuration
  THEME_COLOR: "#4F46E5",
  SHOW_TREASURE_POSITION_FOR_TESTING: false, // Set to true only for testing

  // Gas configuration
  GAS_LIMIT:300000, // Set a reasonable gas limit
  GAS_PRICE: "2000000000" // 1 Gwei (adjust as needed)
};
