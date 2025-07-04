const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const {
    adminCredentialsUpdate,
    addCourse,
    addFaculty, 
    addStudent, 
    listAllFaculty, 
    listAllStudents,
    mapFacultyToCourse, 
    listAllCourses,
    mapStudentIdsToCourseId,
    deleteStudent, 
    adminUpdationOfFacultyDetails, 
    adminUpdationOfStudentDetails
} = require('../controllers/adminController');

// updation credentials
router.post('/update-credentials',verifyToken,verifyAdmin,adminCredentialsUpdate);

// creation of course
router.post('/add-course',verifyToken,verifyAdmin,addCourse);

// creation of Faculty
router.post('/add-faculty',verifyToken,verifyAdmin,addFaculty);

// creation of Student
router.post('/add-student',verifyToken,verifyAdmin,addStudent);

// List All Faculty
router.get('/list-all-faculty',verifyToken,verifyAdmin,listAllFaculty);

// List All Students
router.get('/list-all-students',verifyToken,verifyAdmin,listAllStudents);

// List All Course
router.get('/list-all-courses',verifyToken,verifyAdmin,listAllCourses);

// Admin upation of Faculty Details
router.put('/admin-updation-faculty-details/:facultyId',verifyToken,verifyAdmin,adminUpdationOfFacultyDetails);

// Admin updation of Student Details
router.put('/admin-updation-student-details/:studentId',verifyToken,verifyAdmin,adminUpdationOfStudentDetails);

// Mapping Faculty to Course
router.post('/map-faculty-to-course',verifyToken,verifyAdmin,mapFacultyToCourse);

// Mapping Student to the map(Faculty to Course)
router.post('/map-studentIds-to-map-of-facultytocourse',verifyToken,verifyAdmin,mapStudentIdsToCourseId);

// Delete Student from studentModel and Faculty-course Mapping
router.post('/delete-student',verifyToken,verifyAdmin,deleteStudent);

module.exports = router;