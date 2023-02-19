const AppError = require('../utils/appError')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

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
        const user = await User.findById(decoded._id)
        if(!user){
            return next(new AppError('User belonging to the token no longer exists', 403));
        }
        req.user = user
    }catch(err){
        return next(new AppError('Authentication Failed', 403));
    }
    next()
}