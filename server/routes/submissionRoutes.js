import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  aiDebug,
  listAllSubmissions,
  listMySubmissions,
  runCode,
  seedActivity,
  submitCode,
} from '../controllers/apiController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const submitLimiter = rateLimit({ windowMs: 30 * 1000, max: 5 });
const aiLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

router.post('/run', authMiddleware, runCode);
router.post('/submit', authMiddleware, submitLimiter, submitCode);
router.post('/ai-debug', authMiddleware, aiLimiter, aiDebug);
router.get('/submissions', authMiddleware, listMySubmissions);
router.get('/submissions/all', authMiddleware, listAllSubmissions);
router.post('/submissions/seed-activity', authMiddleware, seedActivity);

export default router;
