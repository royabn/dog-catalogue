import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

async function start() {
  await connectDatabase();
  app.listen(env.port, () => console.info(`API listening on http://localhost:${env.port}`));
}

start().catch((error) => {
  console.error('Unable to start API', error);
  process.exit(1);
});
