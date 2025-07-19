const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyFaculty = require('../middleware/verifyFaculty');

const { 
    facultyCredentialsUpdate,
    ListOfAssignedCourses,
    getDetailsOfLoggedFaculty,
    listStudentsOfCourseMapping,
    listQuestionSetsOfCourseMapping,
    createQuestionSet,
    addListOfQuestionToQuestionSet,
    editQuestion,
    deleteQuestion
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

// Creation Of Question Set of Particular Course Mapping
router.post('/create-questionset-mapping/:courseMappingId',verifyToken,verifyFaculty,createQuestionSet);

// Add List Of Questions To The Question Set
router.post('/add-list-of-questions-questionSet/:questionSetId',verifyToken,verifyFaculty,addListOfQuestionToQuestionSet);

// Edit question
router.put('/edit-question/:questionId',verifyToken,verifyFaculty,editQuestion);

// Delete Question
router.delete('/delete-question/:questionId',verifyToken,verifyFaculty,deleteQuestion);

module.exports = router;