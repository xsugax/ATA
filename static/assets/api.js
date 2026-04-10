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

/* Client-side celebrity roster  mirrors backend algorithm exactly.
   Used as an instant fallback when Render backend is sleeping.    */
const _CATS  = ['Film','Music','Sports','Fashion','Business','Influencer'];
const _REGS  = ['North America','Europe','Middle East','Asia','Latin America','Africa'];
const _AGENCS= ['CAA','WME','UTA','Independent Office','Roc Nation','IMG'];
const _AVAIL = ['Open','Limited','Waitlist'];
const _SEEDS = [
  {name:'Beyonce',category:'Music',region:'North America'},
  {name:'Leonardo DiCaprio',category:'Film',region:'North America'},
  {name:'Cristiano Ronaldo',category:'Sports',region:'Europe'},
  {name:'Kim Kardashian',category:'Fashion',region:'North America'},
  {name:'Drake',category:'Music',region:'North America'},
  {name:'Dwayne Johnson',category:'Film',region:'North America'},
];

export function buildFallbackRoster() {
  return Array.from({length:100},(_,i) => {
    const seed = i < _SEEDS.length ? _SEEDS[i] : {};
    const cat  = seed.category || _CATS[i % _CATS.length];
    const reg  = seed.region   || _REGS[i % _REGS.length];
    const base = 150000 + ((i * 17000) % 1350000);
    return {
      id: `c${i+1}`,
      name: seed.name || `Global Icon ${i+1}`,
      category: cat, region: reg,
      portrait: `https://i.pravatar.cc/400?img=${((i) % 70) + 1}`,
      agencyRepresentation: _AGENCS[i % _AGENCS.length],
      availability: _AVAIL[i % 3],
      demandIndex: 55 + (i * 7) % 45,
      averageEventRate: Math.round(base * 1.18),
      socialReachMillions: Number((20 + ((i * 3.8) % 280)).toFixed(1)),
      bookingTiers: [
        {type:'Private Event',      startPrice: Math.round(base)},
        {type:'Corporate Keynote',  startPrice: Math.round(base * 1.25)},
        {type:'Brand Endorsement',  startPrice: Math.round(base * 1.7)},
        {type:'Virtual Appearance', startPrice: Math.round(base * 0.65)},
      ],
    };
  });
}

const ATA_LOGO = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0">
  <defs>
    <linearGradient id="ata-g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#0d9488"/>
      <stop offset="1" stop-color="#38bdf8"/>
    </linearGradient>
  </defs>
  <rect width="36" height="36" rx="10" fill="url(#ata-g)"/>
  <circle cx="18" cy="7.5" r="2" fill="rgba(255,255,255,0.7)"/>
  <text x="18" y="25" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12.5" font-weight="900" fill="white" letter-spacing="1.5">ATA</text>
</svg>`;

const TICKER_DATA = [
  {name:'Beyonce',          price:'$2.4M', event:'Private Gala \u00b7 Dubai'},
  {name:'Cristiano Ronaldo',price:'$1.8M', event:'Corporate Summit \u00b7 Abu Dhabi'},
  {name:'Drake',            price:'$950K', event:'Brand Launch \u00b7 Miami'},
  {name:'Kim Kardashian',   price:'$1.2M', event:'Fashion Week \u00b7 Milan'},
  {name:'Global Icon #38',  price:'$340K', event:'Festival \u00b7 London'},
  {name:'Global Icon #54',  price:'$780K', event:'Private Event \u00b7 Monaco'},
  {name:'Global Icon #71',  price:'$220K', event:'Tech Summit \u00b7 San Francisco'},
  {name:'Global Icon #15',  price:'$560K', event:'Charity Gala \u00b7 Paris'},
];

function buildTicker() {
  const items = [...TICKER_DATA, ...TICKER_DATA];
  return items.map(i =>
    `<span class="ticker-item"><span class="ticker-dot"></span><span class="ticker-name">${i.name}</span><span class="faint"> \u2014 </span><span class="ticker-price">${i.price}</span><span class="faint"> \u00b7 ${i.event}</span></span>`
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
          <div class="brand-sub">Agency \u00b7 Sovereign Bookings</div>
        </div>
      </a>
      <nav class="menu">
        <a href="index.html"     class="${active==='home'      ? 'active' : ''}">Dashboard</a>
        <a href="explorer.html"  class="${active==='explorer'  ? 'active' : ''}">Explorer</a>
        <a href="crowdfund.html" class="${active==='crowdfund' ? 'active hot' : 'hot'}">&#9889; Crowdfund</a>
        <a href="portal.html"    class="${active==='portal'    ? 'active' : ''}">Portal</a>
        <a href="login.html"     class="${active==='login'     ? 'active' : ''}">Access</a>
      </nav>
    </header>
  </div>`;
}