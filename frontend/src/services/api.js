const baseUrl = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'REQUEST_FAILED', errors = {} } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = errors;
  }
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection and try again.', { code: 'NETWORK_ERROR' });
  }

  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(body.message || 'Request failed', {
      status: response.status,
      code: body.code,
      errors: body.errors,
    });
  }
  return body;
}

export const dogsApi = {
  list: (params) => request(`/dogs?${new URLSearchParams(params)}`),
  create: (dog) => request('/dogs', { method: 'POST', body: JSON.stringify(dog) }),
  update: (id, dog) => request(`/dogs/${id}`, { method: 'PUT', body: JSON.stringify(dog) }),
  remove: (id) => request(`/dogs/${id}`, { method: 'DELETE' }),
};
