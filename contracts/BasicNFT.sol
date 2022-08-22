// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNFT is ERC721 {
    string public constant TOKEN_URI = "ipfs://QmTAn2gtUk5Sy6U2JRdt2dY87yWerzLcPYBkGZeMHucX86";
    uint256 private s_tokenCounter;
    constructor() ERC721("Onix", "ONIX"){
        s_tokenCounter=0;
    }

    function mintNft() public returns(uint256){
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter ++;
        return s_tokenCounter;
    }

    function tokenURI(uint256 tokenId) public view override returns(string memory){
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns(uint256){
        return s_tokenCounter;
    }
}