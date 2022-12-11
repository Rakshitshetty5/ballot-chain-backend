const sendEmail = require('../utils/email');
const Otp = require('../models/otp.model')
const VoterDetails = require('../models/voterDetails.model')
const User = require('../models/user.model')
const isValidUser = require('../middleware/isValidUser.middleware')
const express = require('express');
const router = express.Router()

router.post('/getOTP', async (req, res) => {
    const { voter_id } = req.body;

    if(!voter_id){
        return res.status(400).json({
            message: "Invalid Voter Id"
        }) 
    }

    //check if voter id is valid
    const isPresent = await VoterDetails.findOne({ voter_id })
    if(!isPresent){
        return res.status(400).json({
            message: "Invalid Voter Id"
        }) 
    }

    // After validation generate otp
    const otp = Math.floor(100000 + Math.random() * 9000) //this returns otp in range 1000-9999

    const email = isPresent.email
    const voter_details_id = isPresent._id

    const otpExists = await Otp.findOne({ email })
    if(otpExists){
        await Otp.deleteOne({ email }) 
    }

    //store email along with otp (otp schema)
    await Otp.create({ email, otp })

    // Send otp to the client
    const message = `Your OTP is ${otp}. This otp expires in 10mins`

    try{
        await sendEmail({
            email: email,
            subject: 'Blockchain App OTP',
            message
        })
        return res.status(200).json({
            status: 'Success',
            data: { email, voter_details_id },
            message: 'OTP sent to email'
        })
    }catch(err){
        return res.status(500).json({
            status: 'Failure',
            message: 'There was an error sending the email'
        })
    }
})


router.post('/verifyOTP', async (req, res) => {
    // Get the otp. 
    const { otp, email, voter_id, voter_details_id } = req.body
    console.log(otp, email)
    // from otp schema get otp using phone no
    const otpData = await Otp.findOne({ email })
    console.log(otpData)

    if(!otpData) {
        return res.status(400).json({
            status: 'Failure',
            message: 'OTP is required'
        })
    }
    // check if otp is valid (compare user provided otp = actual otp)
    if(otpData.otp != otp) {
        return res.status(400).json({
            status: 'Failure',
            message: 'OTP is invalid'
        })
    }

    //check if otp has expired

    if(Date.now() > otpData.otpExpires){
        await Otp.deleteOne({ email })
        return res.status(400).json({
            status: 'Failure',
            message: 'OTP is invalid/expired'
        })
    }

    let user = await User.findOne({ voter_id })
    if(!user){
        user = new User({
            voter_details: voter_details_id,
            voter_id
        })
    
        // store user data in database(user schema) 
        user = await user.save()
    }

    //generate JWT 
    const token = user.generateAccessToken()
    
    // delete otp and email from db
    await Otp.deleteOne({ email })

    return res.status(201).json({
        status: 'success',
        data : {
            token,
            user
        }
    })
})


router.get('/details', isValidUser, async (req, res) => {
    //create middleware and check if valid jwt token
    const user = await User.findOne({ voter_id: req.user.voter_id }).populate('voter_details')

    return res.status(200).json({
        status: 'success',
        data : {
            user
        }
    })

})

module.exports = router