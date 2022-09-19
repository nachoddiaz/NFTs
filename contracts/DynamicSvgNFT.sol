// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/* import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; */
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

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
    function svgToImageURI(string memory svg) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
    }

    function mintNft() public returns (uint256) {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
        return s_tokenCounter;
    }

    //We override the tokenURI function of ERC721.sol to adjust it to our pourpose
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "URI Query for nonexistient token");
        string memory imageURI = " ";
        //The function name() is from the ERC721
        abi.encodePacked(
            '{"name":""',
            name(),
            '", "description": "NFT that chainges based on ETH Price", ',
            '"attributes": [{"trait_type": "coolness", "value": 100}], "image": "',
            imageURI
        );
    }

    //Getters

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
