const baseUrl = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (response.status === 204) return null;
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Request failed');
  return body;
}

export const dogsApi = {
  list: (params) => request(`/dogs?${new URLSearchParams(params)}`),
  create: (dog) => request('/dogs', { method: 'POST', body: JSON.stringify(dog) }),
  update: (id, dog) => request(`/dogs/${id}`, { method: 'PUT', body: JSON.stringify(dog) }),
  remove: (id) => request(`/dogs/${id}`, { method: 'DELETE' }),
};
