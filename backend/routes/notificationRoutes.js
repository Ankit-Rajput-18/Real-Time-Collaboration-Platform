import express from 'express';
import {
  getNotifications,
  markAsRead,
  deleteNotification
} from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.put('/mark-read', verifyToken, markAsRead);
router.delete('/:id', verifyToken, deleteNotification);

export default router;
