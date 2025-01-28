const express = require('express');
const { register, login, protectedRoute } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.get('/protected', authenticateJWT, protectedRoute);


module.exports = router;
