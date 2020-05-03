const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
var key = process.env.KEY;
var ivKey = crypto.randomBytes(16);

async function Encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), ivKey);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        iv: ivKey.toString('hex'),
        encryptedData: encrypted.toString('hex')
    };
};

function Decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

module.exports = {
    Encrypt,
    Decrypt
};