import express from 'express';
import { getWorkspaceActivity, getUserActivity } from '../controllers/activityController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/workspace/:workspaceId', verifyToken, getWorkspaceActivity);
router.get('/user/:userId', verifyToken, getUserActivity);

export default router;
