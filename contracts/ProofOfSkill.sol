// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProofOfSkill is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    uint256 public mintingFee;

    struct Skill {
        string skillName;
    }

    mapping(uint256 => Skill) public tokenIdToSkill;

    constructor(uint256 _mintingFee) ERC721("ProofOfSkill", "POS") {
        tokenCounter = 0;
        mintingFee = _mintingFee;
    }

    function mintSkillNFT(address recipient, string memory skillName, string memory tokenURI) public payable {
        require(bytes(skillName).length > 0, "Skill name cannot be empty");
        require(msg.value >= mintingFee, "Not enough ETH to mint the NFT");
        
        uint256 newItemId = tokenCounter;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenIdToSkill[newItemId] = Skill(skillName);
        tokenCounter += 1;
        
        emit MintedNFT(recipient, newItemId, msg.value);
    }
        
    event MintedNFT(address indexed recipient, uint256 indexed tokenId, uint256 value);


    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }

    function getSkillDetails(uint256 tokenId) public view returns (string memory skillName) {
        Skill memory skill = tokenIdToSkill[tokenId];
        return skill.skillName;
    }
}
