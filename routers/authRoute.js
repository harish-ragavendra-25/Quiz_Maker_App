const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');

const {adminRegister,adminLogin,adminTest} = require('../controllers/adminController');
const {facultyLogin,facultyRegister,facultyTest} = require('../controllers/facultyController');
const {studentLogin,studentRegister,studentTest} = require('../controllers/studentController');

const verifyAdmin = require('../middleware/verifyAdmin');
const verifyFaculty = require('../middleware/verifyFaculty');
const verifyStudent = require('../middleware/verifyStudent');

// Admin Login/signUp routes
router.post('/admin/signup',adminRegister);
router.post('/admin/login',adminLogin);
router.get('/admin/authtest',verifyToken,verifyAdmin,adminTest);

// Faculty Login/signUp routes
router.post('/faculty/signup',facultyRegister);
router.post('/faculty/login',facultyLogin);
router.get('/faculty/facultytest',verifyToken,verifyFaculty,facultyTest);

//Student Login/SignUp routes
router.post('/student/signup',studentRegister);
router.post('/student/login',studentLogin);
router.get('/student/studenttest',verifyToken,verifyStudent,studentTest);

module.exports = router;