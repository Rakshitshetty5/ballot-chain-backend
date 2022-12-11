const mongoose = require('mongoose')

async function connectToDB(){
    await mongoose.connect("mongodb://localhost/ballotchain", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('MongoDB connected')
}

module.exports = connectToDB