const { ethers, deployments, getNamedAccounts, network } = require("hardhat")
const { assert, expect } = require("chai")
const { devChains, networkConfig } = require("../../helper-hardhat-config")

!devChains.includes(network.name)
    ? describe.skip
    : describe("RandomIpfsNFT", function () {
          let RandomIpfsNFT, accounts, deployer
          const chainId = network.config.chainId

          beforeEach(async function () {
              /* accounts = await ethers.getSigners()
              deployer = accounts[0] */
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["mocks", "RandomIpfsNft"])
              RandomIpfsNFT = await ethers.getContract("RandomIpfsNFT", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })

          describe("constructor", function () {
              it("initializes the RandomNFT", async function () {
                  const mintFee = await RandomIpfsNFT.getMintFee()
                  assert.equal(mintFee.toString(), networkConfig[chainId]["mintFee"])
                  const KeyHash = await RandomIpfsNFT.getKeyHash()
                  assert.equal(KeyHash.toString(), networkConfig[chainId]["gasLane"])
                  const TokenUriZero = await RandomIpfsNFT.getTokenUris(0)
                  const isInitialized = await RandomIpfsNFT.getInitialized()
                  assert(TokenUriZero.includes("ipfs://"))
                  assert.equal(isInitialized, true)
              })
          })

          describe("requestNft", function () {
              it("fails if payment inst sent with the request", async function () {
                  await expect(RandomIpfsNFT.requestNft()).to.be.revertedWith(
                      "RandomIpfsNFT__NeedMoreETH"
                  )
              })
              it("fail if payment amount is less than the mint fee", async function () {
                  const mintFee = await RandomIpfsNFT.getMintFee()
                  await expect(
                      RandomIpfsNFT.requestNft({
                          value: mintFee.sub(ethers.utils.parseEther("0.001")),
                      })
                  ).to.be.revertedWith("RandomIpfsNFT__NeedMoreETH")
              })
              it("emits an event and kicks off a random word request", async function () {
                  const mintFee = await RandomIpfsNFT.getMintFee()
                  await expect(RandomIpfsNFT.requestNft({ value: mintFee.toString() })).to.emit(
                      RandomIpfsNFT,
                      "NFTRequested"
                  )
              })
          })
          describe("fulfillRandomWords", () => {
              it("mints NFT after random number is returned", async function () {
                  await new Promise(async (resolve, reject) => {
                    RandomIpfsNFT.once("NFTMinted", async () => {
                          try {
                              const TokenUri = await RandomIpfsNFT.TokenUri("0")
                              const tokenCounter = await RandomIpfsNFT.getTokenCounter()
                              assert.equal(TokenUri.toString().includes("ipfs://"), true)
                              assert.equal(tokenCounter.toString(), "1")
                              resolve()
                          } catch (error) {
                              console.log(error)
                              reject()
                          }
                      })
                      try {
                          const fee = await RandomIpfsNFT.getMintFee()
                          const requestNftResponse = await RandomIpfsNFT.requestNft({
                              value: fee.toString(),
                          })
                          const requestNftReceipt = await requestNftResponse.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestNftReceipt.events[1].args.requestId,
                              RandomIpfsNFT.address
                          )
                      } catch (error) {
                          console.log(error)
                          reject()
                      }
                  })
              })
          })
          describe("getRarityFromModdedRnd", () => {
              it("Returns Definitivo if moddedRnd < 10", async function () {
                  const expectedValue = await RandomIpfsNFT.getRarityFromModdedRnd(8)
                  assert.equal(0, expectedValue)
              })
              it("Returns B&W if moddedRnd 10< <39", async function () {
                  const expectedValue = await RandomIpfsNFT.getRarityFromModdedRnd(25)
                  assert.equal(1, expectedValue)
              })
              it("Returns Primitivo if moddedRnd 40< <99", async function () {
                  const expectedValue = await RandomIpfsNFT.getRarityFromModdedRnd(78)
                  assert.equal(2, expectedValue)
              })
              it("Reverts if moddedRnd >= 100", async function () {
                  const expectedValue = await expect(
                      RandomIpfsNFT.getRarityFromModdedRnd(100)
                  ).to.be.revertedWith("RandomIpfsNFT__RangeOutOfBounds")
              })
          })
      })
