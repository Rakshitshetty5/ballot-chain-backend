const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    user_name: {
        type: String
    },
    password: {
        type: String    
    }
})

adminSchema.methods.generateAccessToken = function(){
    const token = jwt.sign({_id: this._id, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '7d'})
    return token
}

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin

