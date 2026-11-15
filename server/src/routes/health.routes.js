import { Router } from 'express';
import * as c from '../controllers/health.controller.js';

const router = Router();
router.get('/overview', c.overview);
router.get('/cardiovascular', c.cardiovascular);
router.get('/sleep', c.sleep);
router.get('/radiation', c.radiation);
router.get('/fitness', c.fitness);
router.get('/alerts', c.alerts);

export default router;