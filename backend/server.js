const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const db = require('./db/db');

const studentRoutes = require('./routes/students');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
