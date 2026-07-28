import assert from 'node:assert/strict';
import test from 'node:test';
import { isDatabaseReady } from '../src/utils/database.js';

test('database is not ready without a connected driver', async () => {
  assert.equal(await isDatabaseReady({ readyState: 0 }), false);
});

test('database readiness verifies the connection with a ping', async () => {
  let command;
  const connection = {
    readyState: 1,
    db: {
      admin: () => ({
        command: async (value) => { command = value; },
      }),
    },
  };

  assert.equal(await isDatabaseReady(connection), true);
  assert.deepEqual(command, { ping: 1, maxTimeMS: 1_000 });
});

test('database is not ready when its ping fails', async () => {
  const connection = {
    readyState: 1,
    db: {
      admin: () => ({
        command: async () => { throw new Error('database unavailable'); },
      }),
    },
  };

  assert.equal(await isDatabaseReady(connection), false);
});
