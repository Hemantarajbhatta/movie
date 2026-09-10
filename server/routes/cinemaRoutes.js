import express from 'express';
import { getCinemas, getCinemaById, createCinema, updateCinema, deleteCinema } from '../controllers/cinemaController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/').get(getCinemas).post(protect, admin, createCinema);
router.route('/:id').get(getCinemaById).put(protect, admin, updateCinema).delete(protect, admin, deleteCinema);
export default router;
