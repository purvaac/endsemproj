require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [
        "2a3054ee02c2eaf3e19db96e8a07596ef352b951fdc822ffefaed7c51f395c17"
      ]
    }
  },
  solidity: "0.8.28",
};
