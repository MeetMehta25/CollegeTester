const db = require('../db/db');

// Get all students
const getStudents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching students:', err.message);
    res.status(500).send('Server Error');
  }
};

// Add a new student
const addStudent = async (req, res) => {
  const { name, grade, uid, email, contact } = req.body;
  console.log('Incoming student data:', req.body); // 🔍 LOG THIS

  if (!name || !grade || !uid || !email || !contact) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO students (Name, grade, UID, Email, Contact) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, grade, uid, email, contact]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding student:', err.message); // ❌ print exact error
    res.status(500).json({ message: 'Server Error' });
  }
};


// Delete a student by UID
const deleteStudent = async (req, res) => {
  const { uid } = req.params;

  try {
    const result = await db.query('DELETE FROM students WHERE UID = $1 RETURNING *', [uid]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully', deletedStudent: result.rows[0] });
  } catch (err) {
    console.error('Error deleting student:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getStudents,
  addStudent,
  deleteStudent
};
