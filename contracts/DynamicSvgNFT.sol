// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/* import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; */
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@base64-sol/base64.sol";

contract DynamicSvgNFT is ERC721 {
    uint256 private s_tokenCounter;
    string private i_lowSvg; 
    string private i_hihgSvg;
    string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64,";
    //mint
    //Store the SVG info
    //Logic to know whta the ETH price is to show X or Y

    constructor(string memory lowSvg, string memory hihgSvg) ERC721("Dynamic SVG NFT", "DSN") {
        s_tokenCounter = 0;
    }

    //This function turn any svg code into an image
    function svgToImageURI(string memory svg)public pure returns(string memory){
        string memory svgBase64Encoded = Base64.encoded(bytes(string(abi.encodePackage(svg))));
        return string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
    }

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
        return s_tokenCounter;
    }

    //Getters

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
