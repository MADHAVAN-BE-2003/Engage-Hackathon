const web3 = require('./../config/web3');
const { ProofOfSkillABI, contractAddress } = require('./../config/contract');
const contract = new web3.eth.Contract(ProofOfSkillABI, contractAddress);

const mintSkillNFT = async (req, res) => {
    const { skillName, difficulty, tokenURI } = req.body;

    if (!skillName || !difficulty || !tokenURI) {
        return res.status(400).json({ message: 'Skill name, difficulty, and token URI are required.' });
    }

    const accounts = await web3.eth.getAccounts();
    const recipient = accounts[0];

    try {
        const mintingFee = await contract.methods.mintingFee().call();
        const estimatedGas = await contract.methods.mintSkillNFT(recipient, skillName, difficulty, tokenURI).estimateGas({ from: recipient });
        const response = await contract.methods.mintSkillNFT(recipient, skillName, difficulty, tokenURI)
            .send({ from: recipient, value: mintingFee, gas: estimatedGas });
        res.status(200).json({ message: 'NFT minted successfully', transaction: response });
    } catch (error) {
        console.error('Error minting NFT:', error);
        res.status(500).json({ message: 'Failed to mint NFT', error: error.message });
    }
};


module.exports = { mintSkillNFT };
