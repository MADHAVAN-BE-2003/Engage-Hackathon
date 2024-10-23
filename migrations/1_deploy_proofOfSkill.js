const ProofOfSkill = artifacts.require("ProofOfSkill");

module.exports = function (deployer) {
    const mintingFee = web3.utils.toWei('0.01', 'ether');
    deployer.deploy(ProofOfSkill, mintingFee);
};
