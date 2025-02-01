const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.deploy("0xD5a19F394FBF1fF718b57232D014b62Ed9B77Db4", { value: hre.ethers.parseEther("1.0") });

  await escrow.waitForDeployment();
  console.log("Escrow contract deployed to:", await escrow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
