import express from 'express';
import {
  sendMessage,
  getDirectMessages,
  getChannelMessages,
  markAsRead,
  deleteMessage
} from '../controllers/messageController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, sendMessage);
router.get('/direct/:userId', verifyToken, getDirectMessages);
router.get('/channel/:channelId', verifyToken, getChannelMessages);
router.put('/mark-read', verifyToken, markAsRead);
router.delete('/:id', verifyToken, deleteMessage);

export default router;
