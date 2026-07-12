import { Router } from 'express';
import { getProfile, toggleBookmark, updateProfile } from '../controllers/apiController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/:username', getProfile);
router.patch('/', authMiddleware, updateProfile);
router.post('/bookmark/:problemId', authMiddleware, toggleBookmark);

export default router;
