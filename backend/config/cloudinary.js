const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'deplng2ap',
  api_key: '934236475281122',
  api_secret: 'W1SwhC8aZaUp9YQ4VV2TNUmHgoU'
});

module.exports = cloudinary; 