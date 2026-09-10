import express from 'express';
import { initiatePayment, verifyPayment, khaltiInitiate } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/initiate', protect, initiatePayment);
router.post('/verify', protect, verifyPayment);
router.post('/khalti/initiate', protect, khaltiInitiate);
export default router;
