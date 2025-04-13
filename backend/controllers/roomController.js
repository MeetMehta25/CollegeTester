const db = require('../db/db');

// Get all rooms
const getRooms = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM rooms');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching rooms:', err.message);
    res.status(500).send('Server Error');
  }
};

// Add a new room
const addRoom = async (req, res) => {
  const { roomnumber, time, purpose, status } = req.body;
  console.log('Incoming room data:', req.body);

  if (!roomnumber || !time || !purpose || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await db.query(
      'INSERT INTO rooms (roomnumber, time, purpose, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [roomnumber, time, purpose, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding room:', err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a room by ID
const deleteRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room deleted successfully', deletedRoom: result.rows[0] });
  } catch (err) {
    console.error('Error deleting room:', err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getRooms,
  addRoom,
  deleteRoom
};
