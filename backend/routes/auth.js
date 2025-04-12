const express = require('express');
const router = express.Router();
const db = require('../db/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // First check if user exists with this username and role
    const userResult = await db.query(
      'SELECT * FROM user_table WHERE username = $1 AND role = $2',
      [username, role]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or role' });
    }

    const user = userResult.rows[0];
    
    // Then verify password (plaintext comparison - switch to bcrypt in production!)
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Successful login
    res.json({
      user: {  // Wrap in 'user' object to match frontend expectation
        id: user.id,
        username: user.username,  // Make sure to include username
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;