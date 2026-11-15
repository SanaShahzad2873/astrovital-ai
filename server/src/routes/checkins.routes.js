import { Router } from 'express';
import { createCheckin, listCheckins } from '../controllers/checkins.controller.js';
import { validateCheckin } from '../middleware/validate.js';

const router = Router();
router.post('/', validateCheckin, createCheckin);
router.get('/', listCheckins);

export default router;