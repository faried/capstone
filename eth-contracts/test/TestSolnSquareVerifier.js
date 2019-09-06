// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("Verifier");

contract("SolnSquareVerifier", accounts => {

    const deployer = accounts[9];
    const user = accounts[1];
    console.log(`deployer is ${deployer}`);
    console.log(`user is ${user}`);

    before("setup contract", async () => {
        this.verifier = await Verifier.new({from: deployer});
        this.contract = await SolnSquareVerifier.new(this.verifier.address, {from: deployer});
    });

    it("starting with no solutions", async () => {
        const solutions = await this.contract.solutionCount.call();

        assert.equal(solutions, 0, "should be zero solutions");
    });

    it("mint a token", async () => {
        const pjs = require("../../zokrates/code/square/proofs/test-proof-1.json");
        const proof = pjs.proof;
        const inputs = pjs.inputs;

        let success = true;

        try {
            const minted = await this.contract.MintToken(user, 1, proof.a, proof.b, proof.c, inputs,
                                                         {from: deployer});
        }
        catch (e) {
            console.log(e);
            success = false;
        }

        assert.equal(success, true, "could not mint token");
    });

    it("should have one solution now", async () => {
        const solutions = await this.contract.solutionCount.call();

        assert.equal(solutions, 1, "should be one solution");
    });


    it("cannot mint a token against existing solution", async () => {
        const pjs = require("../../zokrates/code/square/proofs/test-proof-1.json");
        const proof = pjs.proof;
        const inputs = pjs.inputs;

        let success = true;

        try {
            const minted = await this.contract.MintToken(user, 2, proof.a, proof.b, proof.c, inputs,
                                                         {from: deployer});
        }
        catch (e) {
            success = false;
        }

        assert.equal(success, false, "should not be able to reuse solution");
    });

    it("can mint a second token", async () => {
        const pjs = require("../../zokrates/code/square/proofs/test-proof-2.json");
        const proof = pjs.proof;
        const inputs = pjs.inputs;

        let success = true;

        try {
            const minted = await this.contract.MintToken(user, 2, proof.a, proof.b, proof.c, inputs,
                                                         {from: deployer});
        }
        catch (e) {
            success = false;
        }

        assert.equal(success, true, "could not mint second token");
    });

    it("should have two solutions now", async () => {
        const solutions = await this.contract.solutionCount.call();

        assert.equal(solutions, 2, "should be two solutions");
    });

});
