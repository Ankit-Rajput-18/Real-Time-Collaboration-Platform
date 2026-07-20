import express from 'express';
import {
  createTask,
  getWorkspaceTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
} from '../controllers/taskController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/:workspaceId/tasks', verifyToken, createTask);
router.get('/:workspaceId/tasks', verifyToken, getWorkspaceTasks);
router.get('/:workspaceId/stats', verifyToken, getTaskStats);
router.get('/task/:id', verifyToken, getTaskById);
router.put('/task/:id', verifyToken, updateTask);
router.delete('/task/:id', verifyToken, deleteTask);

export default router;
