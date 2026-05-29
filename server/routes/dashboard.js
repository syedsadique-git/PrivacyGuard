import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/summary', getDashboardSummary);

export default router;
