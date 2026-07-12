import { Router } from 'express';
import { joinContest, listContests } from '../controllers/apiController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', listContests);
router.post('/:id/join', authMiddleware, joinContest);

export default router;
