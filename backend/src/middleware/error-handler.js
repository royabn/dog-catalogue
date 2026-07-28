import { ZodError } from 'zod';

export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} was not found` });
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  if (error?.type === 'entity.too.large') return res.status(413).json({ message: 'Request body must not exceed 10 KB' });
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) return res.status(400).json({ message: 'Request body contains invalid JSON' });
  if (error instanceof ZodError) {
    return res.status(400).json({
      code: 'VALIDATION_ERROR',
      message: 'Please correct the highlighted fields',
      errors: error.flatten().fieldErrors,
    });
  }
  if (error?.code === 11000) {
    return res.status(409).json({
      code: 'DUPLICATE_BREED',
      message: 'A breed with that name already exists',
      errors: { name: ['A breed with that name already exists.'] },
    });
  }
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
}
