import express from 'express';
import { createBooking, getBookingHistory, getBookingById, cancelBooking, getAllBookings, getStats } from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/stats', protect, admin, getStats);
router.route('/').post(protect, createBooking).get(protect, admin, getAllBookings);
router.get('/history', protect, getBookingHistory);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);
export default router;
