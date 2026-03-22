import express from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/upload.controller.js';
import { verifyToken } from '../utils/verifyuser.js';

const router = express.Router();

// Store file in memory (buffer) - no disk storage needed
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

router.post('/image', verifyToken, upload.single('image'), uploadImage);
router.post('/delete', verifyToken, deleteImage);

export default router;
