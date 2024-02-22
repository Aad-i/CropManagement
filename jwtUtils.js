// jwtUtils.js

const jwt = require('jsonwebtoken');

function generateJWT(userId) {
  return jwt.sign({ userId }, 'development', { expiresIn: '5h' });
}

module.exports = generateJWT;
