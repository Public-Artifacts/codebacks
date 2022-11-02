//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StudentIDGeneratorCodeback {
  address public trustee;
  uint256 public balance;

  using Strings for uint256;
  using SafeMath for uint256;

  event CodebackDeployed(address _creator, address _trustee);
  event CodebackTipReceived(address _from, string _type, string _token, uint _amount);
  event CodebackTipClaimed(address _to, string _type, string _token, uint _amount);
  event TransferSent(address _from, address _destAddr, uint _amount);
  event CodebackUsed(address _from);
  event CodebackTrusteeChanged(address _from, address _to);

  constructor(address trusteeWallet) {
    trustee = trusteeWallet;
    emit CodebackDeployed(msg.sender, trustee);
  }

  receive() payable external {
    balance += msg.value;
    emit CodebackTipReceived(msg.sender, "ETH", "ETH", msg.value);
  }

  function onERC721Received(address _operator, address _from, uint256 _tokenId, bytes memory _data) public virtual returns (bytes4) {
      emit CodebackTipReceived(_operator, "ERC721", msg.sender, 1);
      return this.onERC721Received.selector;
  }

  function withdraw(uint amount, address payable destAddr) public {
    require(msg.sender == trustee, "Only the trustee can withdraw funds");
    require(amount <= balance, "Insufficient funds");

    destAddr.transfer(amount);
    balance -= amount;
    emit CodebackTipClaimed(msg.sender, "ETH", "ETH", amount);
  }

  function withdrawERC20(IERC20 token, uint amount, address payable destAddr) public {
    require(msg.sender == trustee, "Only the trustee can withdraw tokens");
    uint256 erc20balance = token.balanceOf(address(this));
    require(amount <= erc20balance, "Insufficient funds");

    token.transfer(destAddr, amount);
    emit CodebackTipClaimed(msg.sender, "ERC20", token, amount);
  }

  function withdrawERC721(IERC721 token, uint tokenId, address payable destAddr) public {
    require(msg.sender == trustee, "Only the trustee can withdraw tokens");
    require(token.ownerOf(tokenId) == address(this));

    token.safeTransferFrom(address(this), destAddr, tokenId);
    emit CodebackTipClaimed(msg.sender, "ERC721", token, amount);
  }

  function changeTrustee(address newTrustee) public {
    require(msg.sender == trustee, "Only the trustee can change the trustee");
    require(newTrustee != trustee, "New trustee must be different from current trustee");
    trustee = newTrustee;
    emit event CodebackTrusteeChanged(msg.sender, newTrustee);

  }

  function generateRandomStudentId(string memory _identifier) private pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(_identifier))) % 10**24; //10 is modulus and 24 is student id digits based on number of layers
  }

  function setStudentId(uint256 tokenId, address wallet) public returns (uint256) {
    emit CodebackUsed(msg.sender);
    return uint256(generateRandomStudentId(string(abi.encodePacked(tokenId.toString(), wallet))));
  } 

}