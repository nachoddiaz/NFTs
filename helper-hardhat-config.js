const networkConfig = {
    1:{
        name: "ethereum mainnet",
         
    },
    4: { //Configuramos la red Rinkeby con su chainID, nombre y dirección
        name: "rinkeby",
        vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        precioEntrada : "5000000000000000",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", 
        subscriptionId: "10486",
        callbackGasLimit: "500000",
        interval: "30", //son 30 segundos
        mintFee : "50000000000000000",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    5: {
        name : "goerli",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
    },
    137:{
        name: "polygon mainnet",
        ETHUSDPrice: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },
    31337: {
        name: "localhost",
        gasLane: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        callbackGasLimit: "500000",
        NFTTokenURI: "30",
        mintFee : "50000000000000000",
        
    },
}


const devChains = ["hardhat", "localhost"]
const DECIMALS = 18
const INIT_ANSWER =  200000000000

module.exports ={
    networkConfig,
    devChains,
    DECIMALS,
    INIT_ANSWER,
}