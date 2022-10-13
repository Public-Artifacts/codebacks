//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StudentIDGenerator {
  using Strings for uint256;
  using SafeMath for uint256;

  function generateRandomStudentId(string memory _identifier) private pure returns (uint256) {
      return uint256(keccak256(abi.encodePacked(_identifier))) % 10**24; //10 is modulus and 24 is student id digits based on number of layers
  }

  function setStudentId(uint256 tokenId, address wallet) public pure returns (uint256) {
      return uint256(generateRandomStudentId(string(abi.encodePacked(tokenId.toString(), wallet))));
  } 

}