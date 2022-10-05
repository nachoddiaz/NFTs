const { networkConfig, devChains } = require("../helper-hardhat-config.js")
const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify.js")
const { storeImages, storeTokenMetadata } = require("../utils/uploadToPinata.js")

/* Necesitamos pasarle fondos al contrato VRF para fondear la sbscripcion */
const VRF_FUNDS = "1000000000000000000000"
const imagesLocation = "./images/randomNFT"

let tokenURI = [
    "ipfs://Qme1TGnh4KT5iedGQCyRnUN3ytxZBmrneJ8jVRoE1XV7a9",
    "ipfs://QmeD3R6XTivRGNRQSwg756ebxS7qKc1CYheJDikHFyrfHL",
    "ipfs://QmYL8GLKTmRtYebwMQ9fdUwDSoEgLwzggjcuF9AaZMV1zH",
]

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    //With that we can add stats to the NFT
    attributes:[
        {
            trait_type: "Atack",
            value:"100"
        }
    ]
}

//Podemos resumir las dos lineas anteriores en una sola
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let vrfCoordinatorV2Address, subscriptionId
   

    //We need the IPFS hashes of our imgs

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenURI = await handleTokenURI()
    }

    //1. With our own IPFS node
    //2. Using Pinata
    //3. nft.storage

    if (chainId == 31337) {
        //Si estamos en devChain, desplegamos mock
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        //Creamos la subscripción a VRF de manera progrmática
        const TXResponse = await vrfCoordinatorV2Mock.createSubscription()
        const TXReceipt = await TXResponse.wait()
        subscriptionId = TXReceipt.events[0].args.subId
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_FUNDS)
    } else {
        //Si no estamos en devChain, desplegamos normal
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2
        subscriptionId = networkConfig[chainId].subscriptionId
    }

    const arguments = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["callbackGasLimit"],
        tokenURI,
        networkConfig[chainId]["mintFee"],
    ]

    const RandomIpfs = await deploy("RandomIpfsNFT", {
        from: deployer,
        args: arguments,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    /* if (chainId == 31337) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Mock.addConsumer(subscriptionId.toNumber(), RandomIpfs.address)
    } */

    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        log("Verificando....")
        await verify(RandomIpfs.address, arguments)
    }
    log("---------------------------------------------")
}

async function handleTokenURI() {
    tokenURI = []
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)

    for (imageUploadResponsesIndex in imageUploadResponses) {
        //The 3 points unpack the data of the following variable
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponsesIndex].replace(".png", "")
        tokenUriMetadata.description = `The logo of Onix ${tokenUriMetadata.name}`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponsesIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}`)

        //Store JSON to Pinata
        const metadataUploadResponse = await storeTokenMetadata(tokenUriMetadata)
        tokenURI.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs Uploades")
    console.log(tokenURI)
    return tokenURI
}

module.exports.tags = ["all", "RandomIpfsNft", "main"]
