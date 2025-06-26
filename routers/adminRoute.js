const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const {adminCredentialsUpdate,addCourse} = require('../controllers/adminController');

// updation credentials
router.post('/update-credentials',verifyToken,verifyAdmin,adminCredentialsUpdate);

// creation of course
router.post('/add-course',verifyToken,verifyAdmin,addCourse);

module.exports = router;