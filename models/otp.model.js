const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide Email'],
        lowercase: true,
        unique: true,
    },
    otp: {
        type: Number,
        required: [true, 'Please provide OTP'],
        validate: {
            validator: function(otp){
                return otp.toString().length === 6
            },
            message: 'OTP must be 4 digits'
        }
    },
    otpExpires: Date 
})

otpSchema.pre('save', function(next){ 
    this.otpExpires =  Date.now() + 120000

    next()
})

const Otp = mongoose.model('Otp', otpSchema)

module.exports = Otp

// Math.date() + 120000 (2mins in milliseconds)
// 9922426678