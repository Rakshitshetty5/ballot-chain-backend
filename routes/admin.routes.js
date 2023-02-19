const express = require('express');
const router = express.Router()
const Admin = require('../models/admin.model')
const isAdmin = require('../middleware/isAdmin.middleware');
const GeneralSettings = require('../models/GeneralSetting.model');
const Candidate = require('../models/candidate.model');
const Verification = require('../models/verfication.model');
const User = require('../models/user.model');
const { decrypt, encrypt } = require('../utils/crypto')

// admin login api
router.post('/login', async (req, res) => {
    const user_name = req.body.user_name
    const password = req.body.password

    if(!user_name || !password){
         return res.status(400).json({
            message: "Invalid login credentials"
        }) 
    }

    const admin = await Admin.findOne({ user_name })


    if(!admin){
        return res.status(400).json({
            message: "Invalid login credentials"
        }) 
    }
    if(decrypt(admin.password) !== password){
        return res.status(400).json({
            message: "Invalid login credentials!"
        }) 
    }

    const token = admin.generateAccessToken()

    return res.status(201).json({
        status: 'success',
        data : {
            token        
        }
    })
})


// api to verify users
router.put('/verifyUser', isAdmin, async (req, res) => {
     //get user
     let user = await User.findOne({ voter_id: req.body.voter_id })

     //update users isVerified and add wallet address
     user.isVerified = true
     user.wallet_address = req.body.wallet_address
     console.log(req.body.wallet_address, req.body.voter_id)
     const pvn = req.body.wallet_address.substring(0,2) + req.body.voter_id + req.body.wallet_address.substring(2)
     user.pvn = pvn
     user = await user.save()

     await Verification.findByIdAndDelete(req.body.verification_id)
     
     //return
     return res.status(201).json({
        status: 'success',
        data : {
            user        
        }
    })
})

// api to add candidates
router.post('/addCandidate', isAdmin, async (req, res) => {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const middle_name = req.body.middle_name
    const party = req.body.party
    const address = req.body.address
    const party_image = req.body.party_image
    const candidate_image = req.body.candidate_image
    const email = req.body.email
    const phone = req.body.phone
    const dob = req.body.dob

    let candidate = new Candidate({
        first_name,
        last_name,
        middle_name,
        party,
        address,
        party_image,
        candidate_image,
        email,
        phone,
        dob
    })

    candidate = await candidate.save()

    return res.status(201).json({
        status: 'success',
        data : {
            candidate        
        }
    })
})

// api to change voting phase
router.put('/changeVotingPhase', isAdmin, async (req, res) => {
    let data = await GeneralSettings.findOne()
    data.phase = req.body.phase
    data = await data.save()
    return res.status(201).json({
        status: 'success',
        data : {
            data        
        }
    })
})

//Next
//api to get generalSettings
router.get('/getGeneralSettings', isAdmin, async (req, res) => {
    let data = await GeneralSettings.find()

    return res.status(201).json({
        status: 'success',
        data : {
            phase: data[0].phase    
        }
    })
})


//api to reject verification request
router.put('/deleteVerificationRequest', isAdmin, async (req, res) => {
    let verification_id = req.body.verification_id

    const user = await User.findOne({ voter_id: req.body.voter_id })

    user.hasAppliedForVerification = false

    await user.save()

    await Verification.findByIdAndDelete(verification_id)

    return res.status(203).json({
        status: 'success'
    })
})

//api to delete candidate
router.put('/deleteCandidate', isAdmin, async (req, res) => {
    let candidate_id = req.body.candidate_id

    await Candidate.findByIdAndDelete(candidate_id)

    return res.status(203).json({
        status: 'success'
    })
})


// api to get pending verification requests
router.get('/getPendingVerifications', isAdmin, async (req, res) => {
    const pageNo = req.body.pageNo ?? 1
    const limit = req.body.limit ?? 10

    const offset = (pageNo - 1) * limit

    const pendingRequests = await Verification.find().populate('voter_details').skip(offset).limit(limit)
    console.log(pendingRequests)
    return res.status(201).json({
        status: 'success',
        data : {
            pendingRequests        
        }
    })
})

//Note: pagination is pending 

// api to get all users
router.get('/getAllUsers', async (req, res) => {
    const pageNo = req.body.pageNo ?? 1
    const limit = req.body.limit ?? 10

    const offset = (pageNo - 1) * limit

    const users = await User.find().populate('voter_details').skip(offset).limit(limit)
    
    return res.status(201).json({
        status: 'success',
        data : {
            users        
        }
    })
})

//  api to get all candidates
router.get('/getAllCandidates', isAdmin, async (req, res) => {
    const pageNo = req.body.pageNo ?? 1
    const limit = req.body.limit ?? 10

    const offset = (pageNo - 1) * limit
    const candidates = await Candidate.find().skip(offset).limit(limit)
    //4 pagination
    return res.status(201).json({
        status: 'success',
        data : {
            candidates        
        }
    })
})

module.exports = router