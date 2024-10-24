const ProofOfSkill = artifacts.require("ProofOfSkill");

contract("ProofOfSkill", (accounts) => {
    let instance;
    const mintingFee = web3.utils.toWei("0.05", "ether");

    before(async () => {
        instance = await ProofOfSkill.deployed(mintingFee);
    });

    it("should mint a skill NFT successfully", async () => {
        await instance.mintSkillNFT(accounts[0], "Solidity", "testURI", {
            value: mintingFee,
        });
        const skill = await instance.getSkillDetails(0);

        assert.equal(
            skill,
            "Solidity", // Compare the returned string directly
            "Skill name should be 'Solidity'"
        );
    });

    it("should fail to mint an NFT without a skill name", async () => {
        try {
            await instance.mintSkillNFT(accounts[0], "", "testURI", {
                value: mintingFee,
            });
            assert.fail("The transaction should have thrown an error");
        } catch (error) {
            assert(
                error.message.includes("Skill name cannot be empty"),
                "Expected error message not received"
            );
        }
    });

    it("should fail to mint an NFT without paying the minting fee", async () => {
        try {
            await instance.mintSkillNFT(accounts[0], "JavaScript", "testURI", {
                value: 0,
            });
            assert.fail("The transaction should have thrown an error");
        } catch (error) {
            assert(
                error.message.includes("Not enough ETH to mint the NFT"),
                "Expected error message not received"
            );
        }
    });

    it("should allow the owner to withdraw funds", async () => {
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await instance.mintSkillNFT(accounts[1], "Python", "testURI", {
            value: mintingFee,
        });

        await instance.withdraw();

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        assert.isTrue(
            parseInt(finalBalance) > parseInt(initialBalance),
            "Owner should have more ETH after withdrawal"
        );
    });

    it("should retrieve correct skill details after minting multiple NFTs", async () => {
        await instance.mintSkillNFT(accounts[0], "C++", "testURI", {
            value: mintingFee,
        });
        await instance.mintSkillNFT(accounts[0], "Go", "testURI", {
            value: mintingFee,
        });

        const skill1 = await instance.getSkillDetails(2); // Token ID 2 should be "C++"
        const skill2 = await instance.getSkillDetails(3); // Token ID 3 should be "Go"

        assert.equal(
            skill1,
            "C++", // Compare the returned string directly
            "Skill name for token 2 should be 'C++'"
        );
        assert.equal(
            skill2,
            "Go", // Compare the returned string directly
            "Skill name for token 3 should be 'Go'"
        );
    });
});