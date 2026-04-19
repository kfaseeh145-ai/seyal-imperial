const express = require('express');
const router = express.Router();
const { registerUser, verifyUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/verify', verifyUser);
router.post('/login', loginUser);

module.exports = router;
