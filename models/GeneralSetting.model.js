const mongoose = require('mongoose')

const generalSettingSchema = new mongoose.Schema({
    phase: {
        type: Number,
        enum: [1, 2, 3, 4],
    }
})

const GeneralSettings = mongoose.model('GeneralSettings', generalSettingSchema)

module.exports = GeneralSettings
