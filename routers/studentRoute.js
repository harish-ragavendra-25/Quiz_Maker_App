const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyStudent = require('../middleware/verifyStudent');

const {
    studentCredentialsUpdate, 
    getLoggedStudentDetails
} = require('../controllers/studentController');

// Update-credentials
router.post('/update-credentials',verifyToken,verifyStudent,studentCredentialsUpdate);

// Get Logged Student Details
router.get('/get-details',verifyToken,verifyStudent,getLoggedStudentDetails);

module.exports = router;