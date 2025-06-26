const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');

const {adminRegister,adminLogin} = require('../controllers/adminController');
const {facultyLogin,facultyRegister} = require('../controllers/facultyController');
const {studentLogin,studentRegister} = require('../controllers/studentController');

const verifyAdmin = require('../middleware/verifyAdmin');
const verifyFaculty = require('../middleware/verifyFaculty');
const verifyStudent = require('../middleware/verifyStudent');

// Admin Login/signUp routes
router.post('/admin/signup',adminRegister);
router.post('/admin/login',adminLogin);

// Faculty Login/signUp routes
router.post('/faculty/signup',facultyRegister);
router.post('/faculty/login',facultyLogin);

//Student Login/SignUp routes
router.post('/student/signup',studentRegister);
router.post('/student/login',studentLogin);

module.exports = router;