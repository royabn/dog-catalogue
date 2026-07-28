import mongoose from 'mongoose';

export async function isDatabaseReady(connection = mongoose.connection) {
  if (connection.readyState !== 1 || !connection.db) return false;

  try {
    await connection.db.admin().command({ ping: 1, maxTimeMS: 1_000 });
    return true;
  } catch {
    return false;
  }
}
