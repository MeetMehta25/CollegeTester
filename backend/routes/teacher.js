const express = require('express');
const router = express.Router();
const { getTeachers, addTeacher, deleteTeacher } = require('../controllers/teacherController');

router.get('/', getTeachers);
router.post('/', addTeacher);
router.delete('/:tid', deleteTeacher);

module.exports = router;
