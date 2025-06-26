const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const {adminCredentialsUpdate,addCourse, addFaculty, addStudent} = require('../controllers/adminController');

// updation credentials
router.post('/update-credentials',verifyToken,verifyAdmin,adminCredentialsUpdate);

// creation of course
router.post('/add-course',verifyToken,verifyAdmin,addCourse);

// creation of Faculty
router.post('/add-faculty',verifyToken,verifyAdmin,addFaculty);

// creation of Student
router.post('/add-student',verifyToken,verifyAdmin,addStudent);

module.exports = router;