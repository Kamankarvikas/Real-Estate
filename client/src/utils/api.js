const API_BASE = import.meta.env.VITE_API_URL || '';

const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    url = API_BASE + url;
    options.credentials = 'include';

    // Add Authorization header if token exists
    const token = localStorage.getItem('access_token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      };
    }
  }

  const response = await originalFetch(url, options);

  // Clone response to read token without consuming the body
  const cloned = response.clone();
  try {
    const data = await cloned.json();
    if (data && data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
  } catch (e) {
    // Not JSON, ignore
  }

  return response;
};
