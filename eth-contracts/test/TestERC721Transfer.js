const ERC721MintableComplete = artifacts.require("SleepyTokenContract"); // ERC721MintableComplete");

contract("TestERC721Mintable", accounts => {

    const deployer = accounts[9]; // this was accounts[0] in the original test code
    const TOKENS_TO_MINT = 5;

    describe("match erc721 spec", function () {
        before("setup contract", async function () {
            this.contract = await ERC721MintableComplete.new({from: deployer});

            // mint multiple tokens
            for (let i = 1; i <= TOKENS_TO_MINT; i++) {
                await this.contract.mint(accounts[i], i, "not sure", {from: deployer});
            }
        });

        it("approve a valid transfer", async function () {
            let approved = true;

            try {
                await this.contract.approve(accounts[2], 1, {from: deployer});
            }
            catch (e) {
                approved = false;
            }

            assert.equal(approved, true, "unable to approve a transfer");
        });

        it("verify a valid transfer is set up", async function () {
            let address = await this.contract.getApproved.call(1);

            assert.equal(address, accounts[2], `token 1 should be approved for ${accounts[2]}`);
        });

        it("actually perform the transfer", async function () {

            let balanceBefore = await this.contract.balanceOf.call(accounts[2]);

            assert.equal(balanceBefore, 1, `${accounts[2]} should have one token before transfer`);

            await this.contract.safeTransferFrom(accounts[1], accounts[2], 1, {from: accounts[1]});

            let balanceAfter = await this.contract.balanceOf.call(accounts[2]);

            assert.equal(balanceAfter, 2, `${accounts[2]} should have two tokens after transfer`);

            balanceAfter = await this.contract.balanceOf.call(accounts[1]);

            assert.equal(balanceAfter, 0, `${accounts[1]} should have zero tokens after transfer`);
        });

        it("forbid transfer to yourself", async function () {
            let approved = true;

            try {
                await this.contract.approve(accounts[3], 1, {from: accounts[3]});
            }
            catch (e) {
                approved = false;
            }

            assert.equal(approved, false, "transfer to yourself should not have worked");
        });

        it("forbid transfer by third party", async function () {
            let approved = true;

            try {
                await this.contract.approve(accounts[3], 1, {from: accounts[1]});
            }
            catch (e) {
                approved = false;
            }

            assert.equal(approved, false, "transfer by third party should not have worked");
        });

        it("allow a certain account the ability to transfer tokens", async function () {

            let allowed = true;

            try {
                await this.contract.setApprovalForAll(accounts[3], true, {from: accounts[2]});
            }

            catch (e) {
                allowed = false;
            }

            assert.equal(allowed, true, `${accounts[3]} should be allowed to transfer tokens`);
        });

        it("allow transfer by third party", async function () {
            let approved = true;

            try {
                await this.contract.approve(accounts[8], 1, {from: accounts[3]});
            }
            catch (e) {
                approved = false;
            }

            assert.equal(approved, true, "transfer by third party should have worked");

        });

        it("verify a valid third-party transfer is set up", async function () {
            let address = await this.contract.getApproved.call(1);

            assert.equal(address, accounts[8], `token 1 should be approved for ${accounts[8]}`);
        });

    });
});
