const express = require('express');
const router = express.Router();
const { signup, login, logout, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

router.get('/me', protect, getMe);

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;