pragma solidity >=0.4.21 <0.6.0;

import "../../zokrates/code/square/verifier.sol";
import "./ERC721Mintable.sol";

// define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is SleepyTokenContract {

    Verifier private verifierContract;

    // define a solutions struct that can hold an index & an address
    struct Solution {
        uint solIndex;
        address solAddress;
        bytes32 solutionHash;
    }

    // define an array of the above struct
    Solution[] private solutions;
    uint256 private solutionCount_;

    // define a mapping to store unique solutions submitted
    // maps a hash of a solution to a struct
    mapping(bytes32 => Solution) private submitted;

    // Create an event to emit when a solution is added
    event SolutionAdded(uint solIndex, address solAddress, bytes32 solHash);

    constructor(address verifierAddress_) public {
        verifierContract = Verifier(verifierAddress_);
    }

    // getter
    function solutionCount() public view returns (uint256)
    {
        return solutionCount_;
    }

    // Create a function to add the solutions to the array and emit the event
    function addSolution(uint solIndex, address solAddress, bytes32 solHash) internal
    {
        Solution memory s = Solution(solIndex, solAddress, solHash);
        solutions.push(s);
        submitted[solHash] = s;
        solutionCount_ += 1;

        emit SolutionAdded(solIndex, solAddress, solHash);
    }

    // Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as totalSupply
    function MintToken(address to, uint256 tokenId,
                       uint[2] memory a, uint[2][2] memory b, uint[2] memory c,
                       uint[2] memory input) public onlyOwner returns (bool)
    {
        // if the verification step passes, save the solution and mint it
        bytes32 hash = keccak256(abi.encodePacked(a, b, c, input));

        Solution memory existing = submitted[hash];

        require(existing.solAddress == address(0), "solution has already been submitted");

        bool verified = verifierContract.verifyTx(a, b, c, input);
        require(verified, "solution cannot be verified");

        addSolution(solutionCount_, to, hash);

        bool minted = super.mint(to, tokenId, "not used");
        require(minted, "not minted");  // not really needed, we see a revert if something went wrong

        return minted;
    }
}
