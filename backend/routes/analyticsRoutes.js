import express from 'express';
import { getWorkspaceAnalytics, getUserAnalytics } from '../controllers/analyticsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.get('/workspace/:workspaceId', verifyToken, getWorkspaceAnalytics);
router.get('/user', verifyToken, getUserAnalytics);
export default router;
