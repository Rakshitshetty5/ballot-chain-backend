const AppError = require('../utils/appError')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const Admin = require('../models/admin.model')

module.exports = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }else{
        return next(new AppError('You are not logged in to get access', 403));
    }

    let decoded = null
    try{
        decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
        if(!decoded.isAdmin){
            return next(new AppError('Access Denied!!', 403));
        }
        
        const admin = await Admin.findById(decoded._id)
        if(!admin){
            return next(new AppError('Account belonging to the token no longer exists', 403));
        }
    
        req.admin = admin
        next()
    }catch(err){
        return next(new AppError('Authentication Failed', 403));
    }
}