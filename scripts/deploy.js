const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy TreasureHunt contract
  // Parameters: joinFee (in wei), gridSize, turnDuration (in seconds)
  const joinFeeEth = "0.001"; // 0.001 ETH
  const joinFeeWei = ethers.utils.parseEther(joinFeeEth);
  const gridSize = 10;
  const turnDuration = 3600; // 1 hour

  const TreasureHunt = await hre.ethers.getContractFactory("TreasureHunt");
  const treasureHunt = await TreasureHunt.deploy(joinFeeWei, gridSize, turnDuration);

  await treasureHunt.deployed();

  console.log("TreasureHunt deployed to:", treasureHunt.address);
  console.log("Join fee:", joinFeeEth, "ETH");
  console.log("Grid size:", gridSize, "x", gridSize);
  console.log("Turn duration:", turnDuration, "seconds");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
