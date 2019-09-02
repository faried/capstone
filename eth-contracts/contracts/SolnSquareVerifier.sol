pragma solidity >=0.4.21 <0.6.0;

import "../../zokrates/code/square/verifier.sol";
import "./ERC721Mintable.sol";


// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is SleepyTokenContract {

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint index;
        address address_;
    }

    // define an array of the above struct
    Solution[] private solutions;


// TODO define a mapping to store unique solutions submitted


    // Create an event to emit when a solution is added
    event SolutionAdded(uint index, address address_);


    // Create a function to add the solutions to the array and emit the event
    function addSolution(uint solIndex, address solAddress) public
    {
        Solution memory s = Solution(solIndex, solAddress);
        solutions.push(s);

        emit SolutionAdded(solIndex, solAddress);
    }

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

}
