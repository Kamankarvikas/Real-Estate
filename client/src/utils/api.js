const API_BASE = import.meta.env.VITE_API_URL || '';

const originalFetch = window.fetch;
window.fetch = (url, options) => {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    url = API_BASE + url;
  }
  return originalFetch(url, options);
};
