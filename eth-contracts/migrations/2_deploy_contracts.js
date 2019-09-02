// migrating the appropriate contracts
const SquareVerifier = artifacts.require("./verifier.sol");
const SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
    deployer.deploy(SquareVerifier);
    deployer.deploy(SolnSquareVerifier);
};
