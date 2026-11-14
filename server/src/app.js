import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes.js';
import checkinsRoutes from './routes/checkins.routes.js';
import nasaRoutes from './routes/nasa.routes.js';
import miscRoutes from './routes/misc.routes.js';
import { twinState } from './controllers/health.controller.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, service: 'astrovital-api', time: new Date().toISOString() });
});

app.use('/api/health', healthRoutes);
app.use('/api/checkins', checkinsRoutes);
app.use('/api/nasa', nasaRoutes);
app.get('/api/astronaut/twin-state', twinState);
app.use('/api', miscRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;