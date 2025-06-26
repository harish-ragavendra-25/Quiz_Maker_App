const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyStudent = require('../middleware/verifyStudent');

const {studentCredentialsUpdate} = require('../controllers/studentController');

router.post('/update-credentials',verifyToken,verifyStudent,studentCredentialsUpdate);

module.exports = router;