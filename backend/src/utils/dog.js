import { sanitizePlainText } from './input.js';

export function normalizeDogName(value) {
  return sanitizePlainText(value).toLowerCase();
}

export function normalizeSubBreeds(subBreeds) {
  return [...new Set(subBreeds.map(normalizeDogName))].sort((a, b) => a.localeCompare(b));
}
