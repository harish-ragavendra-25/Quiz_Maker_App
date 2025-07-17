const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyFaculty = require('../middleware/verifyFaculty');

const { 
    facultyCredentialsUpdate,
    ListOfAssignedCourses
 } = require('../controllers/facultyController');

// Updation Of Credentials
router.post('/update-credentials',verifyToken,verifyFaculty,facultyCredentialsUpdate);

// Get List Of Assigned Courses
router.get('/getAssignedCourses',verifyToken,verifyFaculty,ListOfAssignedCourses);

module.exports = router;