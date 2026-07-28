import { isDatabaseReady } from '../utils/database.js';

export async function getHealth(req, res) {
  res.set('Cache-Control', 'no-store');
  const databaseReady = await isDatabaseReady();

  if (!databaseReady) {
    return res.status(503).json({ status: 'unavailable', database: 'disconnected' });
  }

  res.json({ status: 'ok', database: 'connected' });
}
