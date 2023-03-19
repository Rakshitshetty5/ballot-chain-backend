var CryptoJS = require("crypto-js");

const privateKey = process.env.PRIVATE_KEY ?? 'Hello123'

module.exports.encrypt = (password) => {    
    var ciphertext = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(password), privateKey).toString());    
    return ciphertext;
}

module.exports.decrypt = async (password) => {  
    var bytes  = await CryptoJS.AES.decrypt(decodeURIComponent(password.toString()), privateKey);
    var decryptedData = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));    
    return decryptedData;
}

