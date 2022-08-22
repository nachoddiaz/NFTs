const { networkConfig, devChains } = require("../helper-hardhat-config.js")
const {network, ethers } = require("hardhat")
const { verify } = require("../utils/verify.js")

/* Necesitamos pasarle fondos al contrato VRF para fondear la sbscripcion */
const VRF_FUNDS = "1000000000000000000000"

//Podemos resumir las dos lineas anteriores en una sola
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId


    /* if (chainId == 31337) {
        //Si estamos en devChain, desplegamos mock
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        //Creamos la subscripción a VRF de manera progrmática
        const TXResponse = await vrfCoordinatorV2Mock.createSubscription()
        const TXReceipt = await TXResponse.wait(1)
        subscriptionId = TXReceipt.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_FUNDS)
    } else {
        //Si no estamos en devChain, desplegamos normal
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
    } */

    const arguments = [] 

    const BasicNFT = await deploy("BasicNFT", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY ){
        log("Verificando....")
        await verify(BasicNFT.address, arguments)
    }
    log("---------------------------------------------")
}

module.exports.tags = ["all", "BasicNFT"]
