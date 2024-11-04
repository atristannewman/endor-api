const crypto = require('crypto');

const generateToken = (email) => {
  return crypto.createHash('sha256').update(email + Date.now().toString()).digest('hex');
};

module.exports = {
  generateToken,
};