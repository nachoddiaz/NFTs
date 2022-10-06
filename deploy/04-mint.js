const { ethers, network } = require("hardhat")
const { devChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //Basic NFT
    const basicnft = await ethers.getContract("BasicNFT", deployer)
    const basicMintTx = await basicnft.mintNft()
    await basicMintTx.wait(1)
    console.log(`Basic NFT index 0 has tokenURI: ${await basicnft.tokenURI(0)}`)


    //Dynamic SVG NFT
    const highValue = ethers.utils.parseEther("3000")
    const dynamicsvgnft = await ethers.getContract("DynamicSvgNFT", deployer)
    const dynamicsvgnftMintTx = await dynamicsvgnft.mintNft(highValue.toString())
    await dynamicsvgnftMintTx.wait(1)
    console.log(`Dynamic SVG NFT index 0 has tokenURI: ${await dynamicsvgnft.tokenURI(0)}`)



    //Random IPFS NFT
    const randomipfsnft = await ethers.getContract("RandomIpfsNFT", deployer)
    const mintFee = await randomipfsnft.getMintFee()
    const randomipfsnftTx = await randomipfsnft.requestNft({ value: mintFee.toString() })
    await randomipfsnftTx.wait(1)
    const randomipfsnftTxReceipt = await randomipfsnftTx.wait(1)

    await new Promise(async (resolve, reject) => {
        setTimeout(() => reject ("Timeout event didnt fire"), 30000)
        randomipfsnft.once("NFTMinted", async  () => {
            resolve()
        })
       
        if (chainId == 31337) {
            const requestId = randomipfsnftTxReceipt.events[1].args.requestId.toString()
            const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
            await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, randomipfsnft.address)
        }
    })

    console.log(`Random IPFS NFT index 0 has tokenURI: ${await randomipfsnft.tokenURI(0)}`)


}

module.exports.tags = ["all", "mint"]
