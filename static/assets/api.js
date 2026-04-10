const API_BASE = localStorage.getItem('aurelux_api') || 'https://ata-h0yo.onrender.com/api';
export const setApiBase = (v) => localStorage.setItem('aurelux_api', v);
export const token = () => localStorage.getItem('aurelux_token');
export const user  = () => JSON.parse(localStorage.getItem('aurelux_user') || 'null');

export async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...(options.headers || {}),
    },
  });
  let payload = {};
  try { payload = await res.json(); } catch {}
  if (!res.ok) throw new Error(payload.error || 'Request failed');
  return payload;
}

const ATA_LOGO = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
  <defs>
    <linearGradient id="ata-g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#7c3aed"/>
      <stop offset="1" stop-color="#e879f9"/>
    </linearGradient>
  </defs>
  <rect width="36" height="36" rx="10" fill="url(#ata-g)"/>
  <circle cx="18" cy="8" r="2" fill="#f59e0b"/>
  <text x="18" y="25" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12.5" font-weight="900" fill="white" letter-spacing="1.5">ATA</text>
</svg>`;

const TICKER_DATA = [
  {name:'Beyonce',price:'$2.4M',event:'Private Gala  Dubai'},
  {name:'Cristiano Ronaldo',price:'$1.8M',event:'Corporate Summit  Abu Dhabi'},
  {name:'Drake',price:'$950K',event:'Brand Launch  Miami'},
  {name:'Kim Kardashian',price:'$1.2M',event:'Fashion Week  Milan'},
  {name:'Global Icon #38',price:'$340K',event:'Festival  London'},
  {name:'Global Icon #54',price:'$780K',event:'Private Event  Monaco'},
  {name:'Global Icon #71',price:'$220K',event:'Tech Summit  SF'},
  {name:'Global Icon #15',price:'$560K',event:'Charity Gala  Paris'},
];

function buildTicker() {
  const items = [...TICKER_DATA, ...TICKER_DATA];
  return items.map(i =>
    `<span class="ticker-item"><span class="ticker-dot"></span><span class="ticker-name">${i.name}</span><span class="faint">  </span><span class="ticker-price">${i.price}</span><span class="faint">  ${i.event}</span></span>`
  ).join('');
}

export function nav(active) {
  return `
  <div class="ticker-bar"><div class="ticker-inner">${buildTicker()}</div></div>
  <div class="nav-wrap">
    <header class="nav">
      <a href="index.html" class="brand-block">
        ${ATA_LOGO}
        <div class="brand-text">
          <div class="brand">ALL <span>TALENTS</span></div>
          <div class="brand-sub">Agency  Sovereign Bookings</div>
        </div>
      </a>
      <nav class="menu">
        <a href="index.html"      class="${active==='home'      ? 'active' : ''}">Dashboard</a>
        <a href="explorer.html"   class="${active==='explorer'  ? 'active' : ''}">Explorer</a>
        <a href="crowdfund.html"  class="${active==='crowdfund' ? 'active hot' : 'hot'}">&#9889; Crowdfund</a>
        <a href="portal.html"     class="${active==='portal'    ? 'active' : ''}">Portal</a>
        <a href="login.html"      class="${active==='login'     ? 'active' : ''}">Access</a>
      </nav>
    </header>
  </div>`;
}