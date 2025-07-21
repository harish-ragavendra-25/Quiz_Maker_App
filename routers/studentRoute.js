const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyStudent = require('../middleware/verifyStudent');

const {
    studentCredentialsUpdate, 
    getLoggedStudentDetails,
    listOfEnrolledCourses
} = require('../controllers/studentController');

// Update-credentials
router.post('/update-credentials',verifyToken,verifyStudent,studentCredentialsUpdate);

// Get Logged Student Details
router.get('/get-details',verifyToken,verifyStudent,getLoggedStudentDetails);

// Get List Of Enrolled Courses
router.get('/get-list-of-enrolled-courses',verifyToken,verifyStudent,listOfEnrolledCourses);

module.exports = router;