const express = require('express');
const router = express.Router();
const {adminRegister,adminLogin} = require('../controllers/adminAuthController');
// Admin Login/signUp routes
router.post('/admin/signup',adminRegister);
router.post('/admin/login',adminLogin);


// Faculty Login/signUp routes



// student Login/signUp routes

module.exports = router;