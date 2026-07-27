import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { fileURLToPath } from 'node:url';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { dogRouter } from './routes/dog.routes.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin }));
app.use(express.json({ limit: '10kb' }));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1_000, limit: 500, standardHeaders: 'draft-7', legacyHeaders: false }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/dogs', dogRouter);

if (env.nodeEnv === 'production') {
  const frontendDist = fileURLToPath(new URL('../../frontend/dist/', import.meta.url));
  const frontendIndex = fileURLToPath(new URL('../../frontend/dist/index.html', import.meta.url));

  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(frontendIndex);
  });
}

app.use(notFound);
app.use(errorHandler);
