const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyStudent = require('../middleware/verifyStudent');

const {
    studentCredentialsUpdate, 
    getLoggedStudentDetails,
    listOfEnrolledCourses,
    listQuestionSetOfCourseMapping,
    createTestSession,
    updateAnswerTestSession,
    submitTestSession,
    listAllSessionsOfMappings,
    listTestSessionOnId
} = require('../controllers/studentController');

// Update-credentials
router.post('/update-credentials',verifyToken,verifyStudent,studentCredentialsUpdate);

// Get Logged Student Details
router.get('/get-details',verifyToken,verifyStudent,getLoggedStudentDetails);

// Get List Of Enrolled Courses
router.get('/get-list-of-enrolled-courses',verifyToken,verifyStudent,listOfEnrolledCourses);

// Get Question Sets for Particular Mapping
router.get('/get-question-sets/:mappingId',verifyToken,verifyStudent,listQuestionSetOfCourseMapping);

// Create Test Session
router.post('/take-test',verifyToken,verifyStudent,createTestSession);

// Update Answer Test Session
router.put('/take-test/:testSessionId',verifyToken,verifyStudent,updateAnswerTestSession);

// Submit Test Session
router.post('/take-test/submit/:testSessionId',verifyToken,verifyStudent,submitTestSession);

// List All Test Session Mappings
router.post('/list-sessions-mappings/:courseMappingId',verifyToken,verifyStudent,listAllSessionsOfMappings);

// List Test Session on Id
router.get('/list-test-session/:testSessionId',verifyToken,verifyStudent,listTestSessionOnId);

module.exports = router;