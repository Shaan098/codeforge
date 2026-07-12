import { Router } from 'express';
import { getLeaderboard, health } from '../controllers/apiController.js';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import contestRoutes from './contestRoutes.js';
import discussionRoutes from './discussionRoutes.js';
import problemRoutes from './problemRoutes.js';
import profileRoutes from './profileRoutes.js';
import submissionRoutes from './submissionRoutes.js';

const router = Router();

router.get('/health', health);
router.use('/auth', authRoutes);
router.use('/problems', problemRoutes);
router.use('/', submissionRoutes);
router.use('/discussions', discussionRoutes);
router.get('/leaderboard', getLeaderboard);
router.use('/profile', profileRoutes);
router.use('/contests', contestRoutes);
router.use('/admin', adminRoutes);

export default router;
