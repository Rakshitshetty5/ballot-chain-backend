const express = require('express');
const router = express.Router()
const Admin = require('../models/admin.model')
const isAdmin = require('../middleware/isAdmin.middleware');
const GeneralSettings = require('../models/GeneralSetting.model');
const Candidate = require('../models/candidate.model');

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

    //Note admin password should be stored in an encrypted form
    // this password should be decrypted below ---Pending
    if(admin.password !== password){
        return res.status(400).json({
            message: "Invalid user!"
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
     
})

// api to add candidates
router.post('/addCandidate', isAdmin, async (req, res) => {
    
})

// api to change voting phase
router.put('/changeVotingPhase', isAdmin, async (req, res) => {
    let data = await GeneralSettings.find()
    data[0].phase = req.body.phase
    data = await data.save()
    return res.status(201).json({
        status: 'success',
        data : {
            data        
        }
    })
})

// api to get pending verification requests
router.get('/getPendingVerifications', isAdmin, async (req, res) => {
    
})

//Note: pagination is pending 

// api to get all users
router.get('/getAllUsers', isAdmin, async (req, res) => {
    const users = await User.find().populate('voter_details')
    
    return res.status(201).json({
        status: 'success',
        data : {
            users        
        }
    })
})

//  api to get all candidates
router.get('/getAllCandidates', isAdmin, async (req, res) => {
    const candidates = await Candidate.find().populate('voter_details')
    
    return res.status(201).json({
        status: 'success',
        data : {
            candidates        
        }
    })
})

//models
// pending verifications


//For Next time
//3 api
// pagination
// decyrption
