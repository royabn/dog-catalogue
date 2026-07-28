import assert from 'node:assert/strict';
import test from 'node:test';
import { parseListQuery } from '../src/controllers/dog.controller.js';
import { errorHandler } from '../src/middleware/error-handler.js';

function handle(error) {
  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  const originalConsoleError = console.error;
  console.error = () => {};
  try {
    errorHandler(error, {}, response, () => {});
  } finally {
    console.error = originalConsoleError;
  }
  return response;
}

test('validation errors identify the affected field', () => {
  let validationError;
  try {
    parseListQuery({ page: 0 });
  } catch (error) {
    validationError = error;
  }

  const response = handle(validationError);
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.code, 'VALIDATION_ERROR');
  assert.ok(response.body.errors.page[0]);
});

test('duplicate breed errors can be displayed beside the name field', () => {
  const response = handle({ code: 11000 });
  assert.equal(response.statusCode, 409);
  assert.equal(response.body.code, 'DUPLICATE_BREED');
  assert.deepEqual(response.body.errors, { name: ['A breed with that name already exists.'] });
});
