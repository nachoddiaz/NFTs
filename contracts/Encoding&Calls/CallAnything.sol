//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract CallAnything {
    address public s_someAddress;
    uint256 public s_ammount;

    function transfer(address someAddress, uint256 ammount) public {
        s_someAddress = someAddress;
        s_ammount = ammount;
    }

    function getSelector1() public pure returns(bytes4 selector){
        selector = bytes4(keccak256(bytes("transfer(address,uint256)")));
    }

    function getDataToCallTransfer(address someAddress, uint256 ammount) public pure returns (bytes memory){
        return abi.encodeWithSelector(getSelector1(), someAddress, ammount);
    }

    function callTransferfunctionDirectly(address someAddress, uint256 amount) public returns(bytes4, bool){
        (bool success, bytes memory returnData) = address(this).call(
            /* getDataToCallTransfer(someAddress, amount); */
            abi.encodeWithSelector(getSelector1(), someAddress,amount)
        );
        return(bytes4(returnData), success);
    }

    //This function do the same that the combination of getselctor1 + callTransferfunctionDirectly

    function callTransferfunctionDirectlySig(address someAddress, uint256 amount) public returns(bytes4, bool){
        (bool success, bytes memory returnData) = address(this).call(
            /* getDataToCallTransfer(someAddress, amount); */
            abi.encodeWithSignature("transfer(address,uint256)", someAddress,amount)
        );
        return(bytes4(returnData), success);
    }


    //Second way to get the Selector
    function getSelector2() public view returns (bytes4 selector){
        bytes memory functionCallData = abi.encodeWithSignature(
            "transfer(address,uint256)", 
            address(this),
            777
        );
        selector = bytes4(
            bytes.concat(
                functionCallData[0],
                functionCallData[1],
                functionCallData[2],
                functionCallData[3]
            )
        );
    }

    function getCallData() public view returns (bytes memory){
        return abi.encodeWithSignature("transfer(address,uint256)", address(this), 111);
    } 


    //We also can interact with a contract using the opcodes -> "assembly"
    function getSelector3(bytes calldata functionCallData) public pure returns (bytes4 selector){
        // offset is a special attribute of calldata
        assembly {
            selector := calldataload(functionCallData.offset)
        }
    }


    // Another way to get your selector with the "this" keyword
    function getSelector4() public pure returns (bytes4 selector) {
        return this.transfer.selector;
    }

    
    //We saw some ways to get the selector. Now, this is a way to get the signature

    // Just a function that gets the signature
    function getSignatureOne() public pure returns (string memory) {
        return "transfer(address,uint256)";
    }
}


contract CallFunctionWithoutContract {
    address public s_selectorsAndSignaturesAddress;

    constructor(address selectorsAndSignaturesAddress) {
        s_selectorsAndSignaturesAddress = selectorsAndSignaturesAddress;
    }

    // pass in 0xa9059cbb000000000000000000000000d7acd2a9fd159e69bb102a1ca21c9a3e3a5f771b000000000000000000000000000000000000000000000000000000000000007b
    // you could use this to change state
    function callFunctionDirectly(bytes calldata callData) public returns (bytes4, bool) {
        (bool success, bytes memory returnData) = s_selectorsAndSignaturesAddress.call(
            abi.encodeWithSignature("getSelectorThree(bytes)", callData)
        );
        return (bytes4(returnData), success);
    }

    // with a staticcall, we can have this be a view function!
    function staticCallFunctionDirectly() public view returns (bytes4, bool) {
        (bool success, bytes memory returnData) = s_selectorsAndSignaturesAddress.staticcall(
            abi.encodeWithSignature("getSelectorOne()")
        );
        return (bytes4(returnData), success);
    }

    function callTransferFunctionDirectlyThree(address someAddress, uint256 amount)
        public
        returns (bytes4, bool)
    {
        (bool success, bytes memory returnData) = s_selectorsAndSignaturesAddress.call(
            abi.encodeWithSignature("transfer(address,uint256)", someAddress, amount)
        );
        return (bytes4(returnData), success);
    }
}