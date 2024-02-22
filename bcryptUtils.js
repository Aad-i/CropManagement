
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

const comparePasswords = async (userProvidedPassword, storedHashedPassword) => {
  try {
    return await bcrypt.compare(userProvidedPassword, storedHashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

module.exports = { hashPassword, comparePasswords };
