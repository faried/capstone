const ERC721MintableComplete = artifacts.require("SleepyTokenContract"); // ERC721MintableComplete");

contract("TestERC721Mintable", accounts => {

    const deployer = accounts[9]; // this was accounts[0] in the original test code
    const TOKENS_TO_MINT = 5;

    describe("match erc721 spec", function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: deployer});

            // mint multiple tokens
            for (let i = 0; i < TOKENS_TO_MINT; i++) {
                await this.contract.mint(accounts[i+1], i+1, "not sure", {from: deployer});
            }
        });

        it("should return total supply", async function () {
            const supply = await this.contract.totalSupply.call();

            assert.equal(supply, TOKENS_TO_MINT, `should have ${TOKENS_TO_MINT} tokens minuted`);
        });

        it("should get token balance", async function () {
            let tokens = await this.contract.balanceOf.call(accounts[1]);

            assert.equal(tokens, 1, `${accounts[1]} does not have the expected number of tokens`);

            tokens = await this.contract.balanceOf.call(accounts[8]);

            assert.equal(tokens, 0, `${accounts[8]} does not have the expected number of tokens`);
        });

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it("should return token uri", async function () {
            const uri = await this.contract.tokenURI.call(4);

            assert.equal(uri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/4", "URI is incorrect");
        });

        it("should transfer token from one owner to another", async function () {
            // accounts[1] transfers token to accounts[3]
            await this.contract.transferFrom(accounts[1], accounts[3], 1, {from: accounts[1]});

            // accounts[3] should have two tokens
            let tokens = await this.contract.balanceOf.call(accounts[3]);

            assert.equal(tokens, 2, `${accounts[3]} does not have two tokens`);

            // accounts[1] should have zero tokens
            tokens = await this.contract.balanceOf.call(accounts[1]);

            assert.equal(tokens, 0, `${accounts[1]} does not have the zero tokens`);
        });
    });

    describe("have ownership properties", function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: deployer});
        });

        it("should fail when minting when address is not contract owner", async function () {
            let minted = true;

            try {
                await this.contract.mint(accounts[1], 1, "not sure", {from: accounts[2]});
            }
            catch (e) {
                minted = false;
            }

            assert.equal(minted, false, "should not be able to mint tokens by anyone other than the deployer");
        });

        it("should return contract owner", async function () {

            let owner = await this.contract.owner.call();

            assert.equal(owner, deployer, "owner is not deployer");

            // try changing the owner: should fail
            let changedowner = true;
            try {
                await this.contract.transferOwnership(accounts[5], {from: accounts[2]});
            }
            catch (e) {
                changedowner = false;
            }

            assert.equal(changedowner, false, "should not be able to change contract owner unless call is made by owner");

            await this.contract.transferOwnership(accounts[5], {from: deployer});

            owner = await this.contract.owner.call();

            assert.equal(owner, accounts[5], `new owner is not ${accounts[5]}`);
        });
    });
});
