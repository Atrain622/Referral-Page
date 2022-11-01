const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');

exports.getAllReferrals = async (req, res) => {
    const users = await User.find();
    if (users) {
        res.status(200).json(users);
    }
    else {
        res.status(404).json({ errorMessage: 'No user found!' });
    }
}

exports.getOrCreateReferralLinkById = async (req, res) => {
    const user = await User.findOne({ user: req.body.walletAddress });
    if (user) {
        res.status(200).json(user);
    }
    else {
        let genID = uuidv4();
        const user = new User({
            user: req.body.walletAddress,
            referralLink: req.body.referralLink + "/" + genID,
            referralCode: genID
        });

        const saveUser = await user.save();
        if (saveUser) {
            res.status(200).json(saveUser);
        } else {
            res.status(400).json({ errorMessage: 'Referral could not created. Please try again' });
        }
    }
}

exports.addRefferal = async (req, res) => {
    User.findOne({ "referralCode": req.body.referralCode })
        .exec((error, newResult) => {
            console.log(newResult?.referrals.map(r => r === req.body.walletAddress));
            if (newResult?.referrals?.length > 0 && newResult?.referrals.map(r => r === req.body.walletAddress)) {
                res.status(200).json({ successMessage: 'Referral added successfuly!' });
            } else {
                User.findOneAndUpdate(
                    { referralCode: req.body.referralCode },
                    { $push: { referrals: req.body.walletAddress } },
                    function (error, success) {
                        if (error) {
                            res.status(400).json({ errorMessage: 'Referral could not created. Please try again' });
                        } else {
                            res.status(200).json({ successMessage: 'Referral added successfuly!' });
                        }
                    });
            }
        })
}