//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StudentIDGenerator {


  // function setStudentId(uint256 tokenId, address wallet) private {
  //     Students[tokenId] = Student(_generateRandomStudentId(string(abi.encodePacked(tokenId.toString(), wallet))), 0, 0, "");
  // } 

  function generateRandomStudentId(string memory _identifier) public pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(_identifier))) % 10**24; //10 is modulus and 24 is student id digits based on number of layers
  }

  function test() public returns (uint256) {
    return 3;
  }
}