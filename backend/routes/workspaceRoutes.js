import express from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
  updateMemberRole
} from '../controllers/workspaceController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createWorkspace);
router.get('/', verifyToken, getWorkspaces);
router.get('/:id', verifyToken, getWorkspaceById);
router.put('/:id', verifyToken, updateWorkspace);
router.delete('/:id', verifyToken, deleteWorkspace);
router.post('/:id/members', verifyToken, addMember);
router.delete('/:id/members', verifyToken, removeMember);
router.put('/:id/members', verifyToken, updateMemberRole);

export default router;
