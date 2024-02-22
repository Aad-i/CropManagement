// jwtUtils.js

const jwt = require('jsonwebtoken');

function generateJWT(userId) {
  return jwt.sign({ userId }, 'development', { expiresIn: '1h' });
}

module.exports = generateJWT;
