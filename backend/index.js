const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./db/db');
const studentRoutes = require('./routes/students');

const app = express();
const port = 5000;

// PostgreSQL connection


// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use('/api/students', studentRoutes);

// ✅ POST /api/login route
app.post('/api/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM user_table WHERE username = $1 AND password = $2 AND role = $3',
      [username, password, role]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.username,
      email: `${user.username}@example.com`,
      role: user.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route to fetch students
app.get('/api/students', async (req, res) => {
  try {
    const students = await pool.query('SELECT * FROM students'); // or your table name
    res.json(students.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/teachers', async (req, res) => {
  try {
    const students = await pool.query('SELECT * FROM teachers'); // or your table name
    res.json(students.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const students = await pool.query('SELECT * FROM rooms'); // or your table name
    res.json(students.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Start server
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
