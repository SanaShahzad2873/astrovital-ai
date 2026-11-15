import { Router } from 'express';
import { datasets } from '../controllers/nasa.controller.js';

const router = Router();
router.get('/datasets', datasets);

export default router;