const API_BASE = localStorage.getItem('aurelux_api') || 'https://ata-h0yo.onrender.com/api';

export const setApiBase = (value) => localStorage.setItem('aurelux_api', value);
export const token = () => localStorage.getItem('aurelux_token');
export const user = () => JSON.parse(localStorage.getItem('aurelux_user') || 'null');

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...(options.headers || {}),
    },
  });

  let payload = {};
  try { payload = await response.json(); } catch {}
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload;
}

export function nav(active) {
  return `
  <div class="nav-wrap">
    <header class="nav">
      <a href="index.html" class="brand-block">
        <div class="brand">ALL TALENTS</div>
        <div class="brand-sub">Agency</div>
      </a>
      <nav class="menu">
        <a href="index.html" class="${active==='home'?'active':''}">Dashboard</a>
        <a href="explorer.html" class="${active==='explorer'?'active':''}">Explorer</a>
        <a href="portal.html" class="${active==='portal'?'active':''}">Portal</a>
        <a href="login.html" class="${active==='login'?'active':''}">Access</a>
      </nav>
    </header>
  </div>`;
}
