import express from 'express';
import {
  createChannel,
  getWorkspaceChannels,
  getChannelById,
  updateChannel,
  deleteChannel,
  addMember,
  removeMember
} from '../controllers/channelController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/:workspaceId/channels', verifyToken, createChannel);
router.get('/:workspaceId/channels', verifyToken, getWorkspaceChannels);
router.get('/channel/:id', verifyToken, getChannelById);
router.put('/channel/:id', verifyToken, updateChannel);
router.delete('/channel/:id', verifyToken, deleteChannel);
router.post('/channel/:id/members', verifyToken, addMember);
router.delete('/channel/:id/members', verifyToken, removeMember);

export default router;
