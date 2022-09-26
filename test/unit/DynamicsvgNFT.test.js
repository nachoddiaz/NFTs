const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { devChains, networkConfig } = require("../../helper-hardhat-config")

!devChains.includes(network.name)
    ? describe.skip
    : describe("DynamicSvgNFT", function () {

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["mocks", "DynamicSvgNFT"])
              DynamicSvgNft = await ethers.getContract("DynamicSvgNFT", deployer)
              MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
          })
          describe("constructor", function () {
              it("initialices the Dynamic Svg", async function () {
                const tokenCounter = await DynamicSvgNft.getTokenCounter();
                assert.equal(tokenCounter.toString(), "0")
                const lowSvg = await DynamicSvgNft.getTokenCounter();
                assert.equal(lowSvg, )
                const highSvg = await DynamicSvgNft.getTokenCounter();
                const priceFeed = await DynamicSvgNft.getTokenCounter();
              }) 
          })
      })
