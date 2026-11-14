import { Router } from 'express';
import { createReactionTest, createBlackoutEvent, getMissionReport } from '../controllers/misc.controller.js';
import { validateReaction, validateBlackoutEvent } from '../middleware/validate.js';

const router = Router();
router.post('/reaction-test', validateReaction, createReactionTest);
router.post('/blackout/events', validateBlackoutEvent, createBlackoutEvent);
router.get('/reports/mission', getMissionReport);

export default router;