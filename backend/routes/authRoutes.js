import express from 'express';
import { register, login, getProfile, updateProfile, updateStatus, logout } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/status', verifyToken, updateStatus);
router.post('/logout', verifyToken, logout);

export default router;
