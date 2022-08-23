// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";


contract RandomIpfsNFT is VRFConsumerBaseV2, ERC721 {

    //ChainLink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFRMATIONS = 3;
    uint16 private constant NUM_WORDS = 1;

    //Mapping between requestId & requestNFT.msg.sender
    mapping (uint256 => address) public s_requestIdToSender;

    //NFT variables
    uint256 private s_tokenCounter;
    uint256 internal constant MAX_CHANCE_VALUE=100;

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) ERC721("Random IPFS NFT", "RIN"){
        i_vrfCordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
    }

    function requestNft() public returns (uint256 requestId) {
        requestId = i_vrfCordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        s_requestIdToSender[requestId] = msg.sender;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory RandomWords)
        internal
        override
    {
        address NFTOwner = s_requestIdToSender[requestId];
        uint256 newTokenId = s_tokenCounter;
        _safeMint(NFTOwner, newTokenId);
        s_tokenCounter++;

        //coge el resto entre la primera palabra random y el máximo número de probabilidad
        uint256 moddedRnd = RandomWords[0] % MAX_CHANCE_VALUE;

    }

    function getChanceArray() public pure returns (uint256[3] memory) {

        return [10,30,MAX_CHANCE_VALUE];
        
    }



    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        /* return TOKEN_URI; */
    }

     function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
