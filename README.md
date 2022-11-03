# Codebacks
##### An on-chain citation standard for open-source code

This project demonstrates a new primitive for abstracting, monitoring, and rewarding open-source software through citations, inspired by Toby Shorin & Tom Critchlow’s [Quotebacks](https://tomcritchlow.com/2020/06/09/quotebacks/).

Codebacks is a simple implementation standard for creating a single global abstraction for reusable blocks of code that enables on-chain attribution, monitoring, and the ability to tip/reward the original author.

It contains:

1. A citation standard for function-level code attribution. Anyone can create a codeback where they would have copied-and-pasted code. By creating a codeback, they create a global resource for future applications. By invoking that codeback from their application, they give explicit recognition to both the code and its original author as a dependency of their own application.
2. An event emitter for each codeback. Each codeback emits events every time its function is called, allowing the community to see a global view of the applications built with each function, and how often that function is used - visualized via event monitoring tools like [Dune Analytics](https://dune.com/queries/1503075).
3. An option to reward the original author. Codebacks accept optional tips in ETH or any ERC20 or ERC721 token, which can only be withdrawn by the trustee address designated by the codeback creator. The Trustee is meant to be the original publisher of the function.
---
This repo contains a simple proof of concept from a fun NFT project called Zombie State University, written by [Justin Hunter](https://twitter.com/polluterofminds).

[ZSU.sol](./contracts/ZSU.sol) is a copy of the original smart contract for Zombie State University. In it is a function called `setStudentId` that generates a unique identifier for each NFT. That identifier is used in other functions to define the art layers that token will receive. 

Say another developer is creating a project called Vampire Tech University that also needs to set a randomly generated numeric identifier for each token. Previously, this developer might copy and paste the ZSU `setStudentId` function into the new VTU contract. Instead, this developer may choose to create a Codeback as a way to credit Justin's code and make it a public resource for future developers who may like to reuse it.

[StudentIDGeneratorCodeback.sol](./contracts/StudentIDGeneratorCodeback.sol) is a new Codeback contract for the ZSU `setStudentId` function. In addition to the original code, the Codeback contract adds events that allow it to be publicly discoverable, adds functions that allow it to receive and withdraw tokens, and  names the [original ZSU contract's](https://etherscan.io/address/0xdb2448d266d311d35f56c46dd43884b7feeea76b) deployer address as the trustee able to claim any tokens that might be sent to the contract. 

[VTU.sol](./contracts/ZSUCodebackExample.sol) is the new NFT contract that implements the Codeback, by modifying:

```solidity
constructor(...) {
    ...
    setStudentId(tokenId, msg.sender); 
    ... 
}

function _generateRandomStudentId(string memory _identifier) public pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(_identifier))) % 10**24; //10 is modulus and 24 is student id digits based on number of layers
}

function setStudentId(uint256 tokenId, address wallet) private {
    Students[tokenId] = Student(_generateRandomStudentId(string(abi.encodePacked(tokenId.toString(), wallet))), 0, 0, "");
} 
```

from the original ZSU contract, to this in the VTU contract:

```solidity
import {StudentIDGenerator};

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

To tip the original author Justin, a developer would simply call `generator.address.transfer(amount);`. One implementation could be to leave a small tip every time you call the Codeback function:

```solidity
import {StudentIDGenerator};

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
---
One drawback for developers implementing Codeback is the increased gas cost for the developer's users. More testing is needed, but initial testing on the ZSU implementation described above shows that the mint function would require just 7,491 more gas with Codeback, an increase of 3.7%. Both amounts and percentages will vary for different implementations.

However, there are advantages to consider, including reduced size and complexity of new smart contracts, reduciton in redundant code deployed to the blockchain, and the social benefits of clearer recognition of valuable open source code.