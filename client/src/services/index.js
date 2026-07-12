const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('codeforge_token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.response = { data, status: response.status };
    throw error;
  }

  return { data };
}

function jsonBody(body) {
  return JSON.stringify(body);
}

export const authService = {
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: jsonBody({ email, password }),
  }),
  me: () => request('/auth/me'),
};

export const problemService = {
  getAll: () => request('/problems'),
  getById: (id) => request(`/problems/${id}`),
  create: (problem) => request('/admin/problems', {
    method: 'POST',
    body: jsonBody(problem),
  }),
  delete: (id) => request(`/admin/problems/${id}`, { method: 'DELETE' }),
};

export const submissionService = {
  getByUser: () => request('/submissions'),
  run: (payload) => request('/run', {
    method: 'POST',
    body: jsonBody(payload),
  }),
  submit: (payload) => request('/submit', {
    method: 'POST',
    body: jsonBody(payload),
  }),
  aiDebug: (payload) => request('/ai-debug', {
    method: 'POST',
    body: jsonBody(payload),
  }),
  seedActivity: () => request('/submissions/seed-activity', { method: 'POST' }),
};

export const profileService = {
  update: (payload) => request('/profile', {
    method: 'PATCH',
    body: jsonBody(payload),
  }),
  toggleBookmark: (problemId) => request(`/profile/bookmark/${problemId}`, { method: 'POST' }),
};
