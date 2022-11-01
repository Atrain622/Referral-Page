const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    referralLink: {
        type: String,
        required: true
    },
    referralCode: {
        type: String,
        required: true
    },
    referrals: {
        type: Array,
        default: []
    },
    user: {
        type: String,
        required: true
    }

}, { timestamps: true }
);

const userModel = new mongoose.model('User', userSchema);
module.exports = userModel;
