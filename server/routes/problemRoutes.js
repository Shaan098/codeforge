import { Router } from 'express';
import { getProblem, listProblems } from '../controllers/apiController.js';

const router = Router();

router.get('/', listProblems);
router.get('/:id', getProblem);

export default router;
