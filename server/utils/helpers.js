// utils/helpers.js
const generateAccessKey = () => {
    // Generate a random string of 8 characters using numbers and uppercase letters
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let accessKey = '';
    for (let i = 0; i < 8; i++) {
      accessKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return accessKey;
  };

module.exports=generateAccessKey