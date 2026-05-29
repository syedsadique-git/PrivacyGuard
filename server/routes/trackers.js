import express from 'express';
import { getTrackers, scanTracker, toggleBlock, bulkBlock } from '../controllers/trackerController.js';
import { validate, trackerScanSchema } from '../middleware/validation.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTrackers);
router.post('/scan', validate(trackerScanSchema), scanTracker);
router.patch('/:id/block', toggleBlock);
router.post('/bulk-block', bulkBlock);

export default router;
