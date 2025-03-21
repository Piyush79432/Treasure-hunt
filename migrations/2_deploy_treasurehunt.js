const TreasureHunt = artifacts.require("TreasureHunt");

module.exports = function (deployer) {
  const joinFee = web3.utils.toWei("0.01", "ether"); // Example join fee (0.01 ETH)
  const gridSize = 10; // Example grid size (10x10)
  const turnDuration = 300; // Example turn duration (300 seconds = 5 minutes)

  deployer.deploy(TreasureHunt, joinFee, gridSize, turnDuration);
};
