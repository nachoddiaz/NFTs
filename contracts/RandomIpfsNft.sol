// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract RandomIpfsNFT is VRFConsumerBaseV2{


    constructor(address vrfCoordinatorV2) VRFConsumerBaseV2(vrfCoordinatorV2){
        
    }

    function requestNft() public {
    s_requestId = COORDINATOR.requestRandomWords(
      keyHash,
      s_subscriptionId,
      requestConfirmations,
      callbackGasLimit,
      numWords
    );
    }

    function fulfillRandomWords(uint256 requestId, unit256[] memory RandomWords) internal override{

    }

    function tokenURI(uint256 tokenId) public view override returns(string memory){
        return TOKEN_URI;
    }
}