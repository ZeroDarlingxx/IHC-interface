const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.get('/verify', authMiddleware.verifyToken, authController.verifyToken);

router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

router.put('/profile', authMiddleware.verifyToken, authController.updateProfile);

router.put('/change-password', authMiddleware.verifyToken, authController.changePassword);

module.exports = router;