import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, uploadPoster } from '../controllers/movieController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) => cb(null, `poster-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.route('/').get(getMovies).post(protect, admin, createMovie);
router.post('/upload', protect, admin, upload.single('poster'), uploadPoster);
router.route('/:id').get(getMovieById).put(protect, admin, updateMovie).delete(protect, admin, deleteMovie);

export default router;
