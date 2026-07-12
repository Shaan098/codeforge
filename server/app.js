import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import config from './config/env.js';
import apiRoutes from './routes/index.js';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan(config.isDev ? 'dev' : 'combined'));
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api', apiRoutes);

const clientDist = path.join(process.cwd(), 'client', 'build');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({ message: 'CodeForge API is running. Start the Vite client separately on port 5173.' });
  });
}

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: config.isDev ? err.message : 'Internal Server Error' });
});

export default app;
