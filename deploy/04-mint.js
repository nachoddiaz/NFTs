const { ethers, network } = require("hardhat")

module.exports = async ({ getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()

    const basicnft = await ethers.getContract("BasicNFT", deployer)
    const basicMintTx = await basicnft.mintNft()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await basicnft.tokenURI(0)}`)

    const randomipfsnft = await ethers.getContract("RandomIpfsNFT")
    const randomipfsnftTx = await randomipfsnft.mintNft()
    await randomipfsnftTx.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await randomipfsnft.tokenURI(0)}`)

    const dynamicsvgnft = await ethers.getContract("DynamicSvgNFT")
}
