const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    voter_id: {
        type: String
    },
    voter_details: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VoterDetails',
    },
    wallet_address: {
        type: String    
    },
    pvn: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    hasAppliedForVerification: {
        type: Boolean,
        default: false
    }
})


userSchema.methods.generateAccessToken = function(){
    const token = jwt.sign({_id: this._id, voter_id: this.voter_id }, process.env.JWT_SECRET, { expiresIn: '2d'})
    return token
}

const User = mongoose.model('User', userSchema)

module.exports = User

