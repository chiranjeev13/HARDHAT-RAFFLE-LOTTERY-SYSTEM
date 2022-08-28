const { ethers, network } = require("hardhat");
const fs = require("fs");
const FRONT_END_ADDRESSES_FILE =
  "../nextjs-lottery/nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json";
const FRONT_END_ABI_FILE =
  "../nextjs-lottery/nextjs-smartcontract-lottery-fcc/constants/abi.json";
console.log(FRONT_END_ADDRESSES_FILE);

module.exports = async function () {
  if (process.env.UPDATE_FRONTEND) {
    console.log("UPDATING frontend!!");
    updateContractAddress();
    updateabi();
  }
};
async function updateabi() {
  const raffle = await ethers.getContract("Raffle");
  fs.writeFileSync(
    FRONT_END_ABI_FILE,
    raffle.interface.format(ethers.utils.FormatTypes.json)
  );
}
async function updateContractAddress() {
  const chainId = network.config.chainId.toString;
  const raffle = await ethers.getContract("Raffle");
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
  );
  if (chainId in currentAddresses) {
    if (!currentAddresses[chainId].includes(raffle.address)) {
      currentAddresses[chainId].push(raffle.address);
    }
  }

  currentAddresses[chainId] = [raffle.address];

  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses));
}
