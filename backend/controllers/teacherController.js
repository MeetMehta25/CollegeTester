const db = require('../db/db');

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM teachers');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching teachers:', err.message);
    res.status(500).send('Server Error');
  }
};

// Add a new teacher
const addTeacher = async (req, res) => {
  const { TID, Name, Department, Subjects, JoinDate } = req.body;
  console.log('Incoming teacher data:', req.body); // 🔍 LOG THIS

  if (!TID || !Name || !Department || !Subjects || !JoinDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO teachers (TID, Name, Department, Subjects, JoinDate) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [TID, Name, Department, Subjects, JoinDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding teacher:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a teacher by TID
const deleteTeacher = async (req, res) => {
  const { tid } = req.params;

  try {
    const result = await db.query('DELETE FROM teachers WHERE TID = $1 RETURNING *', [tid]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher deleted successfully', deletedTeacher: result.rows[0] });
  } catch (err) {
    console.error('Error deleting teacher:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getTeachers,
  addTeacher,
  deleteTeacher
};
