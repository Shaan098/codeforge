import { Router } from 'express';
import {
  adminCreateProblem,
  adminDeleteProblem,
  adminListProblems,
  adminListUsers,
  adminStats,
  adminUpdateProblem,
} from '../controllers/apiController.js';
import { adminOnly, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware, adminOnly);
router.get('/problems', adminListProblems);
router.post('/problems', adminCreateProblem);
router.put('/problems/:id', adminUpdateProblem);
router.delete('/problems/:id', adminDeleteProblem);
router.get('/users', adminListUsers);
router.get('/stats', adminStats);

export default router;
