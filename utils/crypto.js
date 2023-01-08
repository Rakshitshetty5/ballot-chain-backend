var CryptoJS = require("crypto-js");

const privateKey = process.env.PRIVATE_KEY ?? 'Hello123'

module.exports.encrypt = (password) => {    
    var ciphertext = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(password), privateKey).toString());    
    return ciphertext;
}

module.exports.decrypt = (password) => {  
    var bytes  = CryptoJS.AES.decrypt(decodeURIComponent(password), privateKey);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));    
    return decryptedData;
}

