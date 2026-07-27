export const MAX_BREED_LENGTH = 80;
export const MAX_SUB_BREEDS = 20;
export const MAX_SUB_BREED_INPUT_LENGTH = 500;
export const MAX_SEARCH_LENGTH = 80;

export function sanitizePlainText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ');
}

export function parseSubBreeds(value) {
  return sanitizePlainText(value).split(',').map((item) => item.trim()).filter(Boolean);
}
