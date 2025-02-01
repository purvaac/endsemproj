const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow Contract", function () {
  let Escrow, escrow, client, freelancer;

  beforeEach(async () => {
    [client, freelancer] = await ethers.getSigners();
    Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(freelancer.address, { value: ethers.parseEther("1.0") });
    await escrow.waitForDeployment();
  });

  it("should store correct freelancer address", async function () {
    expect(await escrow.freelancer()).to.equal(freelancer.address);
  });

  it("should allow client to release payment", async function () {
    await escrow.connect(client).releasePayment();
    expect(await escrow.isPaid()).to.equal(true);
  });

  it("should allow client to dispute", async function () {
    await escrow.connect(client).dispute();
    expect(await escrow.isDisputed()).to.equal(true);
  });

  it("should prevent releasing payment after dispute", async function () {
    await escrow.connect(client).dispute();
    await expect(escrow.connect(client).releasePayment()).to.be.revertedWith("Payment is disputed");
  });
});
