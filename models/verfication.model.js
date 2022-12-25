const mongoose = require('mongoose')

const verificationSchema = new mongoose.Schema({
    voter_id: {
        type: String
    },
    voter_details: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VoterDetails',
    },
    wallet_address: {
        type: String    
    }
})


const Verification = mongoose.model('Verification', verificationSchema)

module.exports = Verification

