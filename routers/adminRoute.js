const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

const {adminCredentialsUpdate} = require('../controllers/adminController');

router.post('/update-credentials',verifyToken,verifyAdmin,adminCredentialsUpdate);

module.exports = router;