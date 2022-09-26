const { networkConfig, devChains } = require("../helper-hardhat-config.js")
const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify.js")
const fs = require("fs")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress

    if (chainId == 31337) {
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = EthUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }

    const lowSVG = fs.readFileSync("./images/dynamicNFT/frown.svg", { encoding: "utf8" })
    const highSVG = fs.readFileSync("./images/dynamicNFT/happy.svg", { encoding: "utf8" })

    arguments = [ethUsdPriceFeedAddress, lowSVG, highSVG]

    const DynamicSvg = await deploy("DynamicSvgNFT", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        log("Verificando....")
        await verify(DynamicSvg.address, arguments)
    }
    log("---------------------------------------------")
}

module.exports.tags = ["all", "DynamicSvgNFT"]
