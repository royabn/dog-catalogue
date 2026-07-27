export function sanitizePlainText(value) {
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
