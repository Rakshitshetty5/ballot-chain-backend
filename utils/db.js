const mongoose = require('mongoose')

async function connectToDB(){
    await mongoose.connect("mongodb+srv://patilsushiloo47:FoVuzY4uEvJCaBNc@cluster0.vxvljtt.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('Connected to DB'));
}

module.exports = connectToDB