import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';
import { Dog } from '../src/models/Dog.js';
import { normalizeDogName, normalizeSubBreeds } from '../src/utils/dog.js';

const sourcePath = new URL('../../dogs.json', import.meta.url);
const batchSize = 500;

async function importDogs() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  const source = JSON.parse(await readFile(sourcePath, 'utf8'));
  const entries = Object.entries(source);
  await mongoose.connect(process.env.MONGODB_URI);

  for (let index = 0; index < entries.length; index += batchSize) {
    const operations = entries.slice(index, index + batchSize).map(([name, subBreeds]) => ({
      updateOne: {
        filter: { name: normalizeDogName(name) },
        update: { $set: { subBreeds: normalizeSubBreeds(subBreeds) }, $setOnInsert: { name: normalizeDogName(name) } },
        upsert: true,
      },
    }));
    await Dog.bulkWrite(operations, { ordered: false });
  }

  console.info(`Imported ${entries.length} breeds from dogs.json`);
  await mongoose.disconnect();
}

importDogs().catch(async (error) => {
  console.error('Import failed', error);
  await mongoose.disconnect();
  process.exit(1);
});
