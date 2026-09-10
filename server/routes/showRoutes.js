import express from 'express';
import { getShows, getShowById, getShowSeats, createShow, updateShow, deleteShow } from '../controllers/showController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(getShows).post(protect, admin, createShow);
router.get('/:id/seats', protect, getShowSeats);
router.route('/:id').get(getShowById).put(protect, admin, updateShow).delete(protect, admin, deleteShow);
export default router;
