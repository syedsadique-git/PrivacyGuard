import express from 'express';
import { getMonthlyReport } from '../controllers/reportsController.js';
import { authMiddleware, premiumMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/monthly', premiumMiddleware, getMonthlyReport);

export default router;
