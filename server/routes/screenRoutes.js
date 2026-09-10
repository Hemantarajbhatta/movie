import express from 'express';
import { getScreensByCinema, getScreenById, createScreen, updateScreen, deleteScreen } from '../controllers/screenController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/cinema/:cinemaId', getScreensByCinema);
router.route('/').post(protect, admin, createScreen);
router.route('/:id').get(getScreenById).put(protect, admin, updateScreen).delete(protect, admin, deleteScreen);
export default router;
