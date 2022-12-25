const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const candidateSchema = new mongoose.Schema({
    party: {
        type: String
    },
    voter_id: {
        type: String
    },
    candidate_image: {
        type: String
    },
    party_image: {
        type: String
    },
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
    email: {
        type: String,
        required: [true, 'Please provide Email'],
        unique: true,
        lowercase: true
    },
    phone: {
        type: Number,
    },
    dob: {
        type: String,
        required: [true, 'Please provide date of birth']
    }
})

const Candidate = mongoose.model('Candidate', candidateSchema)

module.exports = Candidate

