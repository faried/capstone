const ERC721MintableComplete = artifacts.require("SleepyTokenContract"); // ERC721MintableComplete");

contract("TestERC721Mintable", accounts => {

    const deployer = accounts[9]; // this was accounts[0] in the original test code

    describe("check pause/unpause code", function () {
        before("setup contract", async function () {
            this.contract = await ERC721MintableComplete.new({from: deployer});
        });

        it("unpaused: can mint a token", async function () {
            let minted = true;
            try {
                await this.contract.mint(accounts[0], 1, "not sure", {from: deployer});
            }
            catch (e) {
                minted = false;
            }

            assert.equal(minted, true, "unable to mint token");
        });

        it("paused: cannot mint a token", async function () {
            let minted = true;

            await this.contract.setPaused(true, {from: deployer});

            try {
                await this.contract.mint(accounts[1], 1, "not sure", {from: deployer});
            }
            catch (e) {
                minted = false;
            }

            assert.equal(minted, false, "should be unable to mint token");
        });

        it("unpaused: should transfer token from one owner to another", async function () {
            await this.contract.setPaused(false, {from: deployer});

            // accounts[0] transfers token to accounts[1]
            await this.contract.transferFrom(accounts[0], accounts[1], 1, {from: accounts[0]});

            // accounts[1] should have one token
            let tokens = await this.contract.balanceOf.call(accounts[1]);

            assert.equal(tokens, 1, `${accounts[1]} does not have one token`);

            // accounts[0] should have zero tokens
            tokens = await this.contract.balanceOf.call(accounts[0]);

            assert.equal(tokens, 0, `${accounts[0]} does not have the zero tokens`);
        });

        it("paused: should not transfer token from one owner to another", async function () {
            await this.contract.setPaused(true, {from: deployer});

            let transferred = true;

            try {
                // accounts[1] transfers token to accounts[0]
                await this.contract.transferFrom(accounts[1], accounts[0], 1, {from: accounts[1]});
            }

            catch (e) {
                transferred = false;
            }

            assert.equal(transferred, false, "contract not paused properly");
        });
    });
});
