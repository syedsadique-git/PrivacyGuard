import express from 'express';
import { checkBreach, getMonitoredEmails, monitorEmail } from '../controllers/breachController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can check a breach (no auth required)
router.get('/', checkBreach);

// Protected routes - require auth
router.get('/monitored', authMiddleware, getMonitoredEmails);
router.post('/monitor', authMiddleware, monitorEmail);

export default router;
