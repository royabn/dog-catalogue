import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
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
app.use(notFound);
app.use(errorHandler);
