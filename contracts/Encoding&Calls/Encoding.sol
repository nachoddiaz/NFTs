//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Encoding{

    function combineString() public pure returns(string memory){
        return string(abi.encodePacked("hi mom ", "bye mom"));
    }

    function encodeNumber() public pure returns(bytes memory){
        bytes memory number = abi.encode(1);
        return number;
    }

    function encodeString() public pure returns(bytes memory){
        bytes memory somestring = abi.encode("im nacho");
        return somestring;
    }

    function encodeStringPacked() public pure returns(bytes memory){
        bytes memory somestring = abi.encodePacked("im nacho");
        return somestring;
    }

     function encodeStringBytes() public pure returns(bytes memory){
        bytes memory somestring = bytes("im nacho");
        return somestring;
    }

    function decodeString() public pure returns(string memory){
        string memory somestring = abi.decode(encodeString(), (string));
        return somestring;
    }

    function multiencode() public pure returns(bytes memory){
        bytes memory somestring = abi.encode("this string", " other string");
        return somestring;
    }

    function multidecode() public pure returns(string memory, string memory){
        (string memory someString, string memory OtherString) = abi.decode(
            multiencode(), 
            (string, string)
        );
        return (someString, OtherString);
    }

    function multiencodePacked() public pure returns(bytes memory){
        bytes memory somestring = abi.encodePacked("this string", " other string");
        return somestring;
    }

    function multiStringCastPacked() public pure returns(string memory){
        string memory somestring = string(multiencodePacked());
        return somestring;
    }


    
    //Example of call/staticcall
    function withdraw(address recentWinner) public{
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        require(success, "Transfer Failed");
    }
}