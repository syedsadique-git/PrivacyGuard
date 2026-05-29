import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';
import { googleLogin } from '../controllers/googleAuthController.js';
import { validate, signupSchema, loginSchema } from '../middleware/validation.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/google', googleLogin);
router.get('/me', authMiddleware, getMe);

export default router;
