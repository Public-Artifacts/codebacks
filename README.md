# Forkbacks

This project demonstrates a new primitive for recognizing and rewarding open-source software, inspired by Toby Shorin & Tom Critchlow's [Quotebacks](https://tomcritchlow.com/2020/06/09/quotebacks/). 

One of the major advantages of Web3 is the composability of protocols as "lego blocks" to combine and configure into new applications. We often think of these lego blocks at the protocol level, but even those protocols are built using bedrock contract functions that often appear over and over again.

Traditionally, when developers re-use code written by someone else, they can fork an entire repo or they can copy-and-paste individual files or functions within a repo, hopefully with citation. In both cases, the true value that original code holds in the community is hard to determine.

*A Forkback breaks one or more functions out of their original project into a clean smart contract where they can be called by developers who wish to implement the same functionality in their own projects.*

---

Anyone can create a Forkback instead of copying-and-pasting code. By doing so, the creator helps bring public recognition to the original author through the two defining features of a Forkback:

1. Forkbacks emit events every time they are called, so the community can see which applications are built with that function and how often the function is used using event monitoring tools like Dune Analytics.

2. Forkbacks accept optional tips in ETH or any ERC20 or ERC721 token, which can only be withdrawn by the trustee designated by the creator. The Trustee is meant to be the original publisher of the function.
---
This repo contains a simple proof of concept from a fun NFT project called Zombie State University, written by [Justin Hunter](https://twitter.com/polluterofminds).

[ZSU.sol](./contracts/ZSU.sol) is a copy of the original smart contract for Zombie State University. It contains a function called `generateRandomStudentId` that generates a unique identifier for each NFT that defines the art layers that token will receive. This function could certainly be used for other projects, and rather than copy-and-pasting it, a developer may choose to create a Forkback as a way to credit Justin's work.

[Forkback_StudentIDGenerator.sol](./contracts/Forkback_StudentIDGenerator.sol) is a new Forkback contract for the ZSU `generateRandomStudentId` function. The contract adds functions to receive and withdraw tokens, and names the [original ZSU contract's](https://etherscan.io/address/0xdb2448d266d311d35f56c46dd43884b7feeea76b) deployer address as the trustee. 

[ZSU_forkback.sol](./contracts/ZSU_forkback.sol) demonstrates how a developer could implement the Forkback, by modifying:

```solidity
constructor(...) {
    ...
    setStudentId(tokenId, msg.sender); 
    ... 
}

function _generateRandomStudentId(string memory _identifier)
    public
    pure
    returns (uint256)
{
    return uint256(keccak256(abi.encodePacked(_identifier))) % 10**24; //10 is modulus and 24 is student id digits based on number of layers
}

function setStudentId(uint256 tokenId, address wallet) private {
    Students[tokenId] = Student(_generateRandomStudentId(string(abi.encodePacked(tokenId.toString(), wallet))), 0, 0, "");
} 
```

to this:

```solidity
constructor(...) {
    ...
    generator = StudentIDGenerator(generatorContract);
    setStudentId(tokenId,msg.sender);
    ...
}

function setStudentId(uint256 tokenId, address wallet) private {
    Students[tokenId] = Student(generator.setStudentId(tokenId, wallet), 0, 0, "");
}
```

To tip the original author Justin, a developer would simply call `generator.address.transfer(amount);`. One implementation could be to leave a small tip every time you call the Forkback function:

```solidity
constructor(...) {
    ...
    generator = StudentIDGenerator(generatorContract);
    setStudentId(tokenId,msg.sender);
    ...
}

function setStudentId(uint256 tokenId, address wallet) private {
    Students[tokenId] = Student(generator.setStudentId(tokenId, wallet), 0, 0, "");
    generator.address.transfer(amount);
}
```
