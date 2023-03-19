const mongoose = require('mongoose')

const voterDetailsSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please provide firstname']
    },
    last_name: {
        type: String,
        required: [true, 'Please provide firstname']
    },
    middle_name: {
        type: String,
        required: [true, 'Please provide lastname']
    },
    voter_id: {
        type: String,
        required: [true, 'Please provide lastname'],
        unique: true,
    },
    address: {
        type: String,
        required: [true, 'Please provide lastname']
    },
    email: {
        type: String,
        required: [true, 'Please provide Email'],
        lowercase: true,
        unique: true,
    },
    image: {
        type: String,
        required: [true, 'Please provide Image']
    },
    phone: {
        type: Number,
    },
    dob: {
        type: String,
        required: [true, 'Please provide date of birth']
    }
})

const VoterDetails = mongoose.model('VoterDetails', voterDetailsSchema)

module.exports = VoterDetails

