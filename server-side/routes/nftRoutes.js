const express = require('express');
const { mintSkillNFT } = require('./../controllers/nftController');
const authMiddleware = require('./../middlewares/authMiddleware');

const router = express.Router();

router.post('/mint', authMiddleware, mintSkillNFT);

module.exports = router;
