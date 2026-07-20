import express from 'express';
import multer from 'multer';
import { uploadFile, deleteFile, getFiles } from '../controllers/fileController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', verifyToken, upload.single('file'), uploadFile);
router.delete('/', verifyToken, deleteFile);
router.get('/', verifyToken, getFiles);

export default router;
