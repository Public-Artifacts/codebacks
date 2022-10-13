require("@nomicfoundation/hardhat-toolbox");

const ALCHEMY_API_KEY = "34Ej7oC93v72wK8wKniZsx6NAVag3fTJ";
const GOERLI_PRIVATE_KEY = "8d5ad2887b63a06f6bb03c87ea695283efcd62820890feb7bdf7b2ae8afc6783";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      // gasLimit: 100000000429720
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  },
  solidity: "0.8.17",
  etherscan: {
    apiKey: "H1KDGRFTAB1TXGVIDN87KX9XIENMS7MIQV"
  }
};
