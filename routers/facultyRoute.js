const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyFaculty = require('../middleware/verifyFaculty');

const { 
    facultyCredentialsUpdate,
    ListOfAssignedCourses,
    getDetailsOfLoggedFaculty,
    listStudentsOfCourseMapping,
    listQuestionSetsOfCourseMapping
 } = require('../controllers/facultyController');

// Updation Of Credentials
router.post('/update-credentials',verifyToken,verifyFaculty,facultyCredentialsUpdate);

// Get List Of Assigned Courses
router.get('/getAssignedCourses',verifyToken,verifyFaculty,ListOfAssignedCourses);

// Get details of Logged Faculty
router.get('/get-logged-faculty-details',verifyToken,verifyFaculty,getDetailsOfLoggedFaculty);

// List Students of Particular Course Faculty Mapping
router.get('/list-students-course-mapping/:mappingId',verifyToken,verifyFaculty,listStudentsOfCourseMapping);

// List Question Sets of Particular Course Mapping
router.get('/list-all-question-set/:mappingId',verifyToken,verifyFaculty,listQuestionSetsOfCourseMapping);

module.exports = router;