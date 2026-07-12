import { Router } from 'express';
import {
  addDiscussionReply,
  createDiscussion,
  listDiscussions,
  voteDiscussion,
} from '../controllers/apiController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', listDiscussions);
router.post('/', authMiddleware, createDiscussion);
router.post('/:id/vote', authMiddleware, voteDiscussion);
router.post('/:id/replies', authMiddleware, addDiscussionReply);

export default router;
