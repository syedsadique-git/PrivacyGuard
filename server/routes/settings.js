import express from 'express';
import { getSettings, updateSettings, deleteAccount } from '../controllers/settingsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getSettings);
router.patch('/', updateSettings);
router.delete('/account', deleteAccount);

export default router;
