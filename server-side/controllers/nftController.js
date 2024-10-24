const web3 = require('./../config/web3');
const { ProofOfSkillABI, contractAddress } = require('./../config/contract');
const contract = new web3.eth.Contract(ProofOfSkillABI, contractAddress);

const mintSkillNFT = async (req, res) => {
    const { skillName, tokenURI } = req.body;

    if (!skillName || !tokenURI) {
        return res.status(400).json({ message: 'Skill name and token URI are required.' });
    }

    const accounts = await web3.eth.getAccounts();
    const recipient = accounts[0];

    try {
        const mintingFee = await contract.methods.mintingFee().call();
        const balance = await web3.eth.getBalance(recipient);

        if (new web3.utils.BN(balance).lt(new web3.utils.BN(mintingFee))) {
            return res.status(400).json({
                message: 'Insufficient funds for minting',
                balance: `${web3.utils.fromWei(balance, 'ether')} ETH`,
                requiredAmount: `${web3.utils.fromWei(mintingFee, 'ether')} ETH`,
                error: 'Not enough ETH to mint the NFT',
            });
        }

        const estimatedGas = await contract.methods.mintSkillNFT(recipient, skillName, tokenURI)
            .estimateGas({ from: recipient, value: mintingFee });

        const response = await contract.methods.mintSkillNFT(recipient, skillName, tokenURI)
            .send({ from: recipient, value: mintingFee, gas: estimatedGas });

        res.status(200).json({ message: 'NFT minted successfully', transaction: response });
    } catch (error) {
        console.error('Error minting NFT:', error);
        res.status(500).json({ message: 'Failed to mint NFT', error: error.message });
    }
};

module.exports = { mintSkillNFT };
