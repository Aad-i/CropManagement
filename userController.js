// userController.js

const express = require('express');
const router = express.Router();
const pool = require('./db');
const { hashPassword, comparePasswords } = require('./bcryptUtils');
const generateJWT = require('./jwtUtils');

router.get('/', (req, res) => {
    res.send('Hello, this is the root path!');
  });

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, phoneNumber, email } = req.body;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert user into the database
    const [result] = await pool.execute(
      'INSERT INTO Users (username, password, phoneNumber, email) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, phoneNumber, email]
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
      'SELECT * FROM Users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // Compare the hashed password
    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateJWT(user.id);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
