import assert from 'node:assert/strict';
import test from 'node:test';
import { ZodError } from 'zod';
import { getMaxPage, maxResultWindow, parseListQuery } from '../src/controllers/dog.controller.js';

test('list query uses safe defaults', () => {
  assert.deepEqual(parseListQuery({}), {
    page: 1,
    limit: 12,
    sort: 'name',
    search: '',
  });
});

test('list query accepts the final page inside the result window', () => {
  const limit = 9;
  const page = getMaxPage(limit);
  assert.equal(page, Math.ceil(maxResultWindow / limit));
  assert.equal(parseListQuery({ page, limit }).page, page);
});

test('list query rejects a page beyond the result window', () => {
  assert.throws(
    () => parseListQuery({ page: maxResultWindow + 1, limit: 1 }),
    (error) => error instanceof ZodError && error.flatten().fieldErrors.page?.length === 1
  );
});

test('list query rejects unsafe and unsupported paging values', () => {
  for (const query of [
    { page: 0 },
    { page: Number.MAX_SAFE_INTEGER, limit: 100 },
    { limit: 0 },
    { limit: 101 },
  ]) {
    assert.throws(() => parseListQuery(query), ZodError);
  }
});
