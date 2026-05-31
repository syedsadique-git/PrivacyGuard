import express from 'express';
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  cancelSubscription,
} from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-order', authMiddleware, createOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.get('/subscription-status', authMiddleware, getSubscriptionStatus);
router.post('/cancel-subscription', authMiddleware, cancelSubscription);

export default router;
