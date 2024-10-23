const ProofOfSkill = artifacts.require("ProofOfSkill");

contract("ProofOfSkill", accounts => {
    let instance;

    before(async () => {
        instance = await ProofOfSkill.deployed();
    });

    it("should mint a skill NFT", async () => {
        const mintingFee = web3.utils.toWei('0.05', 'ether');
        await instance.mintSkillNFT(accounts[0], "React.js", "Medium", "testURI", { value: mintingFee });
        const skill = await instance.getSkillDetails(0);

        assert.equal(skill.skillName, "React.js", "Skill name should be 'React.js'");
        assert.equal(skill.difficulty, "Medium", "Difficulty should be 'Medium'");
    });


    it("should fail to mint without valid parameters", async () => {
        try {
            await instance.mintSkillNFT(accounts[0], "", "Medium", "testURI");
            assert.fail("The transaction should have thrown an error");
        } catch (error) {
            assert(error.message.includes("revert"), "Expected revert error, got: " + error.message);
        }
    });
});
