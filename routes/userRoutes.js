const express = require('express');
const { getOrCreateReferralLinkById, getAllReferrals, addRefferal } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllReferrals);
router.post('/check', getOrCreateReferralLinkById);
router.put('/add/:id', addRefferal);

module.exports = router;