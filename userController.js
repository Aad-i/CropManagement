const express = require('express');
const router = express.Router();
const pool = require('./db');
const { hashPassword, comparePasswords } = require('./bcryptUtils');
const generateJWT = require('./jwtUtils');
const short = require('short-uuid');

router.get('/', (req, res) => {
  res.send('Hello, this is the root path!');
});

// Create a short UUID generator
const shortUuid = short();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, phoneNumber, email } = req.body;

    // Check if any required field is missing
    if (!username || !password || !phoneNumber || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Generate a short UUID starting with 'u'
    const userid = 'u' + shortUuid.new();

    // Check if the user already exists in the database
    const [existingUsers] = await pool.execute(
      'SELECT * FROM Users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Username or email is already in use' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert user into the database with generated userid
    const [result] = await pool.execute(
      'INSERT INTO Users (userid, username, password, phoneNumber, email) VALUES (?, ?, ?, ?, ?)',
      [userid, username, hashedPassword, phoneNumber, email]
    );

    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Retrieve user from the database
    const [rows] = await pool.execute(
      'SELECT userid, username, password FROM Users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const storedHashedPassword = user.password;

    // Compare the hashed password using bcrypt
    const passwordMatch = await comparePasswords(password, storedHashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateJWT(user.userid);

    res.json({ token });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
