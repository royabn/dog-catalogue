import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeDogName, normalizeSubBreeds } from '../src/utils/dog.js';
import { sanitizePlainText } from '../src/utils/input.js';

test('sanitizes unsafe and repeated whitespace', () => {
  assert.equal(sanitizePlainText('  Great\u0000  <Dane>  '), 'Great Dane');
});

test('normalizes breed names consistently', () => {
  assert.equal(normalizeDogName('  Shiba Inu '), 'shiba inu');
});

test('deduplicates and sorts normalized sub-breeds', () => {
  assert.deepEqual(normalizeSubBreeds(['Toy', 'miniature', 'toy']), ['miniature', 'toy']);
});
