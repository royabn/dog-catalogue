import 'dotenv/config';
import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import StreamJson from 'stream-json';
import StreamObject from 'stream-json/streamers/StreamObject.js';
import { Dog } from '../src/models/Dog.js';
import { normalizeDogName, normalizeSubBreeds } from '../src/utils/dog.js';

const { parser } = StreamJson;
const { streamObject } = StreamObject;
const defaultSourcePath = fileURLToPath(new URL('../../dogs.json', import.meta.url));
const sourcePath = resolve(process.argv[2] || defaultSourcePath);
const batchSize = 500;

async function writeBatch(operations) {
  if (!operations.length) return;
  await Dog.bulkWrite(operations, { ordered: false });
  operations.length = 0;
}

async function importDogs() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  await mongoose.connect(process.env.MONGODB_URI);
  await Dog.init();

  const entries = createReadStream(sourcePath).pipe(parser()).pipe(streamObject());
  const operations = [];
  let imported = 0;

  for await (const { key: name, value: subBreeds } of entries) {
    if (!Array.isArray(subBreeds) || subBreeds.some((value) => typeof value !== 'string')) {
      throw new TypeError(`Breed "${name}" must contain an array of sub-breed names`);
    }
    operations.push({
      updateOne: {
        filter: { name: normalizeDogName(name) },
        update: { $set: { subBreeds: normalizeSubBreeds(subBreeds) }, $setOnInsert: { name: normalizeDogName(name) } },
        upsert: true,
      },
    });
    imported += 1;
    if (operations.length === batchSize) await writeBatch(operations);
    if (imported % 5_000 === 0) console.info(`Imported ${imported} breeds…`);
  }

  await writeBatch(operations);
  console.info(`Imported ${imported} breeds from ${sourcePath}`);
  await mongoose.disconnect();
}

importDogs().catch(async (error) => {
  console.error('Import failed', error);
  await mongoose.disconnect();
  process.exit(1);
});
