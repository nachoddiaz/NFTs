const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { devChains, networkConfig } = require("../../helper-hardhat-config")



/* !devChains.includes(network.name)
    ? describe.skip
    : */ describe("BasicNFT", function () {
        let BasicNFT

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["all"])
            BasicNFT = await ethers.getContract("BasicNFT", deployer)            
        })

        describe("constructor", function () {
            it("initializes the NFT", async function () {
                const s_tokenCounter = await BasicNFT.getTokenCounter()
                assert.equal(s_tokenCounter.toString(), "0")
                const name = await basicNft.name()
                assert.equal(name, "Onix")
                const symbol = await basicNft.symbol()
                assert.equal(symbol, "ONIX")
            })
        })

        describe("mintNft", function () {
            it("adds 1 each time a NFT is minted", async function () {
                const s_tokenCounter = await BasicNFT.getTokenCounter()
                await BasicNFT.mintNft()
                const s_tokenCounterafter = await BasicNFT.getTokenCounter()
                assert.equal(s_tokenCounter.add(1).toString() , s_tokenCounterafter.toString())
            })
        })

        describe("tokenURI", function () {
            it("returns the tokenURI", async function () {
                const tokenURI = await BasicNFT.tokenURI(0)
                assert.equal(tokenURI.toString(), "ipfs://QmTAn2gtUk5Sy6U2JRdt2dY87yWerzLcPYBkGZeMHucX86")
            })
        })


    })