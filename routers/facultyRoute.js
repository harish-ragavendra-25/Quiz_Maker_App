const express = require('express');
const router = express.Router();
const { facultyCredentialsUpdate } = require('../controllers/facultyController');

const verifyToken = require('../middleware/verifyToken');
const verifyFaculty = require('../middleware/verifyFaculty');

router.post('/update-credentials',verifyToken,verifyFaculty,facultyCredentialsUpdate);

module.exports = router;