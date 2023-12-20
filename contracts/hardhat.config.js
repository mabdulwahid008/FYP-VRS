require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

module.exports = {
  solidity: "0.8.20",
  networks: {
    ArbitrumSepolia : {
      url: process.env.ARBITRIUM,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: "WIDXMQBE3SZGQBN55CF53DED5JMZTFTRFT"
  }
};
