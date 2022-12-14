// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

error URI_QueryFor_NonExistentToken();

contract DynamicSvgNFT is ERC721, Ownable {
    //global variables
    uint256 private s_tokenCounter;
    string private i_lowSvg;
    string private i_highSvg;
    string private constant base64EncodedSvgPrefix = "data:image/svg+xml;base64,";
    AggregatorV3Interface internal immutable i_priceFeed;
    mapping(uint256 => int256) public s_tokenIdToHighValue;

    //Events
    event NFTCreated__DynamicSvg(uint256 indexed tokenId, int256 HighValue);

    //mint
    //Store the SVG info
    //Logic to know whta the ETH price is to show X or Y

    constructor(
        address priceFeedAddress,
        string memory lowSvg,
        string memory hihgSvg
    ) ERC721("Dynamic SVG NFT", "DSN") {
        s_tokenCounter = 0;
        i_lowSvg = svgToImageURI(lowSvg);
        i_highSvg = svgToImageURI(hihgSvg);
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //This function turn any svg code into an image
    function svgToImageURI(string memory svg) public pure returns (string memory) {
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(base64EncodedSvgPrefix, svgBase64Encoded));
    }

    function mintNft(int256 HighValue) public {
        s_tokenIdToHighValue[s_tokenCounter] = HighValue;
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;

        emit NFTCreated__DynamicSvg(s_tokenCounter, HighValue);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    //We override the tokenURI function of ERC721.sol to adjust it to our pourpose
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert URI_QueryFor_NonExistentToken();
        }

        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        string memory imageURI = i_lowSvg;
        if (price >= s_tokenIdToHighValue[tokenId]) {
            imageURI = i_highSvg;
        }

        //Lo transformamos en string para que sea legible
        return
            string(
                //Esto nos devuelve _baseURI concatenado con todo lo de abajo
                abi.encodePacked(
                    _baseURI(),
                    //Esto nos devuelve el json transformado en bytes y codificado
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":""',
                                //The function name() is from the ERC721
                                name(),
                                '", "description": "NFT that chainges based on ETH Price", ',
                                '"attributes": [{"trait_type": "coolness", "value": 100}], "image": "',
                                imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    //Getters

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function getHighSvg() public view returns (string memory) {
        return i_highSvg;
    }

    function getLowSvg() public view returns (string memory) {
        return i_lowSvg;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }
}
