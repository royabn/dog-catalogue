import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import mongoose from 'mongoose';

async function start() {
  await connectDatabase();
  const server = app.listen(env.port, () => console.info(`API listening on http://localhost:${env.port}`));

  async function shutdown(signal) {
    console.info(`${signal} received, shutting down`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  }

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((error) => {
  console.error('Unable to start API', error);
  process.exit(1);
});
