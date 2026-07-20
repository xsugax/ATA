// Auto-detect API endpoint: localhost in dev, Render backend in production
const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:4000/api'
  : 'https://ata-h0yo.onrender.com/api';
// Override by setting window.ATA_API_URL before this script loads
const _API = window.ATA_API_URL || API;

const TOKEN_KEY = 'ata_token';
const USER_KEY = 'ata_user';

export const token = () => localStorage.getItem(TOKEN_KEY) || localStorage.getItem('aurelux_token');
export const currentUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY) || localStorage.getItem('aurelux_user');
    return JSON.parse(raw || 'null');
  } catch {
    return null;
  }
};
export const user = currentUser;
export const setAuth = (tokenValue, user) => {
  localStorage.setItem(TOKEN_KEY, tokenValue);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.removeItem('aurelux_token');
  localStorage.removeItem('aurelux_user');
};

window.__ataAuth = { token, currentUser, setAuth };

export function requireAuth(returnPath) {
  if (token()) return true;
  const path = returnPath || (location.pathname.replace(/^\//, '') + location.search);
  localStorage.setItem('ata_return', path);
  location.href = 'login.html';
  return false;
}

export function consumeReturnUrl(defaultPath = 'explorer.html') {
  const r = localStorage.getItem('ata_return');
  if (r) {
    localStorage.removeItem('ata_return');
    location.href = r.startsWith('http') ? r : r;
    return true;
  }
  return false;
}

import {
  ASSET_V,
  formatPrice,
  getShortlist,
  setShortlist,
  toggleShortlist,
  getRelatedTalents,
  renderRelatedRail,
  renderShortlistTray,
  bindShortlistTray,
  trackEvent,
  renderCompareMatrix,
  getLocalDemandPulse,
  demandPulseHTML,
  renderDemandPulse,
  getRecentViews,
  paletteSearchRoster,
  parsePaletteIntent,
  recordRecentView,
  searchRoster,
  getSearchSuggestions,
  initSmartSearch,
} from './platform.js';

import {
  PROTOCOL_STEPS,
  renderProtocolSpine,
  renderThreePathBait,
  runAccessPathSimulator,
  renderAccessPathSimulator,
  bindAccessPathSimulator,
  formatAccessBand,
  displayPrice,
  isQualified,
  setQualified,
  getSessionHold,
  setSessionHold,
  clearSessionHold,
  getAccessProgress,
  renderProgressRail,
  renderHoldChipHTML,
  renderEscrowLedger,
  renderRedactedBrief,
  ensureAccessPortalShell,
  openAccessPortal,
  closeAccessPortal,
  openWaitlistReserve,
  triggerWindowHold,
  openQualifyModal,
  bindPathBaitHandlers,
  refreshHoldUI,
  initAccessProtocol,
  initConciergeTriggers,
  ANCHOR_COPY,
  renderBookingDeskSteps,
  BOOKING_DESK_LABELS,
} from './access-protocol.js';

import { getMeetingPlaybook, renderMeetingPlaybookCard } from './meeting-playbooks.js';
import { CELEBRITIES } from './celebrities-data.js';

/** Static roster IDs that map to canonical API ids (e.g. Charlize c167 → API c7). */
const STATIC_API_ID_ALIASES = {
  c167: 'c7',
};

const DEFAULT_SECURITY_TIERS = ['Standard', 'Enhanced', 'Executive', 'Sovereign'];

export function resolveApiCelebrityId(id) {
  return STATIC_API_ID_ALIASES[id] || id;
}

export function bookingSecurityTiers(celeb) {
  const tiers = celeb?.securityTiers;
  return Array.isArray(tiers) && tiers.length ? tiers : DEFAULT_SECURITY_TIERS;
}

export {
  ASSET_V,
  formatPrice,
  getShortlist,
  setShortlist,
  toggleShortlist,
  getRelatedTalents,
  renderRelatedRail,
  renderShortlistTray,
  bindShortlistTray,
  trackEvent,
  renderCompareMatrix,
  getLocalDemandPulse,
  demandPulseHTML,
  renderDemandPulse,
  getRecentViews,
  paletteSearchRoster,
  parsePaletteIntent,
  recordRecentView,
  searchRoster,
  getSearchSuggestions,
  initSmartSearch,
  PROTOCOL_STEPS,
  renderProtocolSpine,
  renderThreePathBait,
  runAccessPathSimulator,
  renderAccessPathSimulator,
  bindAccessPathSimulator,
  formatAccessBand,
  displayPrice,
  isQualified,
  setQualified,
  getSessionHold,
  setSessionHold,
  clearSessionHold,
  getAccessProgress,
  renderProgressRail,
  renderHoldChipHTML,
  renderEscrowLedger,
  renderRedactedBrief,
  openAccessPortal,
  closeAccessPortal,
  openWaitlistReserve,
  triggerWindowHold,
  openQualifyModal,
  bindPathBaitHandlers,
  refreshHoldUI,
  initAccessProtocol,
  initConciergeTriggers,
  ANCHOR_COPY,
  renderBookingDeskSteps,
  BOOKING_DESK_LABELS,
  getMeetingPlaybook,
  renderMeetingPlaybookCard,
  fetchCelebrity,
  fetchCelebrityDossier,
};

export async function request(path, options = {}) {
  const response = await fetch(`${_API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload;
}

function localCelebrity(id, roster = CELEBRITIES) {
  return roster.find((x) => x.id === id) || null;
}

function mergeCelebrity(apiRow, localRow) {
  if (!localRow) return apiRow;
  if (!apiRow) return localRow;
  const merged = { ...apiRow, id: localRow.id, name: localRow.name || apiRow.name };
  const preferLocal = apiRow.name && localRow.name && apiRow.name !== localRow.name;
  const keys = [
    'portrait', 'eliteSignal', 'netWorth', 'agencyRepresentation', 'startingPrice',
    'availability', 'availabilityWindowDays', 'securityTiers', 'category', 'region',
    'demandIndex', 'dynamicPriceRange', 'ndaDefault', 'bookingTiers',
  ];
  for (const key of keys) {
    const localVal = localRow[key];
    const apiVal = apiRow[key];
    if (localVal == null) continue;
    if (preferLocal || apiVal == null || (Array.isArray(apiVal) && !apiVal.length)) {
      merged[key] = localVal;
    }
  }
  if (!merged.securityTiers?.length) merged.securityTiers = localRow.securityTiers || DEFAULT_SECURITY_TIERS;
  return merged;
}

/** API first; static roster + id aliases when API returns 404. */
async function fetchCelebrity(id, roster = CELEBRITIES) {
  const local = localCelebrity(id, roster);
  const tryIds = [id, STATIC_API_ID_ALIASES[id]].filter(Boolean);
  const seen = new Set();
  for (const tid of tryIds) {
    if (seen.has(tid)) continue;
    seen.add(tid);
    try {
      const row = await request('/celebrities/' + tid);
      return mergeCelebrity(row, local);
    } catch {
      /* try next */
    }
  }
  if (local) return local;
  throw new Error('Celebrity not found');
}

function buildLocalDossier(c) {
  const meeting = getMeetingPlaybook(c) || {};
  const idx = Math.max(0, parseInt(String(c.id).replace(/\D/g, ''), 10) - 1);
  const venueOptions = ['Private Estate Gala', 'Flagship Brand Summit', 'Sovereign Corporate Forum', 'Exclusive Cultural Ceremony', 'Invitation-Only Media Event'];
  const leverageMap = {
    low: 'High — Minimal friction, broad campaign compatibility',
    medium: 'Moderate — Strategic alignment required before proposal',
    high: 'Controlled — Executive-only pathway, strict vetting mandatory',
  };
  return {
    celebrity: {
      id: c.id, name: c.name, category: c.category, region: c.region, portrait: c.portrait,
      startingPrice: c.startingPrice, agencyRepresentation: c.agencyRepresentation,
    },
    dossier: {
      meetingHeadline: meeting.headline,
      meetingSteps: meeting.steps,
      classificationLevel: 'PRIVATE — CLIENT EYES ONLY',
      mediaAuthorityScore: Math.min(99, Math.round((c.socialReachMillions / 280) * 100) + 15),
      negotiationLeverage: leverageMap[c.riskIndex] || leverageMap.medium,
      recommendedVenue: venueOptions[idx % venueOptions.length],
      talkingPoints: [
        `Represented exclusively by ${c.agencyRepresentation}. All commercial contact must route through authorized channels.`,
        `Commercial entry threshold: ${formatPrice(c.startingPrice)}. Security default: ${(c.securityTiers || ['Executive']).slice(-1)[0]}.`,
        `Demand index: ${c.demandIndex}% — ${c.demandIndex > 75 ? 'Extreme booking pressure, immediate action advised' : c.demandIndex > 55 ? 'High demand — windows closing rapidly' : 'Moderate demand — opportunity window currently open'}.`,
        `Availability: ${c.availability === 'Open' ? 'Currently accepting qualified outreach' : c.availability === 'Limited' ? 'Limited windows — act within 48 hours of inquiry' : 'Waitlist active — join queue for next opening'}.`,
      ],
      riskBrief: c.riskIndex === 'high'
        ? 'ELEVATED — Executive security protocols required. Full media blackout and thorough vetting enforced.'
        : c.riskIndex === 'medium'
        ? 'MANAGED — NDA activation required. Coordinate all media placement through representation desk.'
        : 'CLEAR — No reputational exposure. Suitable for flagship public campaigns and media-facing events.',
      ndaStatus: c.ndaDefault !== false
        ? 'MANDATORY — NDA is required for all engagements without exception.'
        : 'ADVISORY — NDA strongly recommended depending on event exposure level.',
      optimalLeadTime: c.availability === 'Open' ? '14–21 days via standard pathway' : '30–60 days — limited access windows',
    },
  };
}

async function fetchCelebrityDossier(id, roster = CELEBRITIES) {
  const tryIds = [id, STATIC_API_ID_ALIASES[id]].filter(Boolean);
  const seen = new Set();
  for (const tid of tryIds) {
    if (seen.has(tid)) continue;
    seen.add(tid);
    try {
      return await request('/celebrities/' + tid + '/dossier');
    } catch {
      /* try next */
    }
  }
  const local = localCelebrity(id, roster);
  if (local) return buildLocalDossier(local);
  throw new Error('Celebrity not found');
}

export function nav(active){
  return `<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div><header class="nav"><div class="nav-inner"><a class="nav-brand" href="index.html" title="All Talents Agency — ATA"><div class="brand-mark brand-mark-ata" aria-hidden="true"><svg class="ata-mark-svg" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="navRecord" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#D4E4F4"/><stop offset="50%" stop-color="#A8BDD9"/><stop offset="100%" stop-color="#6E8EAE"/></linearGradient></defs><rect width="44" height="44" rx="6" fill="#060809"/><rect x="1" y="1" width="42" height="42" rx="5" fill="none" stroke="url(#navRecord)" stroke-width="1"/><text x="22" y="28" font-family="IBM Plex Mono,ui-monospace,monospace" font-size="13" font-weight="700" fill="url(#navRecord)" text-anchor="middle" letter-spacing="-0.5">ATA</text><line x1="10" y1="33" x2="34" y2="33" stroke="url(#navRecord)" stroke-width="0.6" opacity="0.45"/></svg></div><div><div class="brand">All Talents Agency <span class="brand-ata-tag">ATA</span></div><div class="brand-sub">Sovereign Celebrity Representation</div></div></a><div style="display:flex;align-items:center;gap:10px"><span class="desk-status-chip" id="deskStatusChip"><span class="ds-dot"></span><span id="deskStatusText">Live desks</span></span><button class="nav-search-btn" id="navSearchBtn" title="Command palette (Ctrl+K)" aria-label="Command palette"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></button><button class="nav-access-btn" id="navAccessBtn" aria-label="Open navigation" aria-expanded="false"><span class="nab-burger"><span></span><span></span></span><span class="nab-text">ACCESS</span></button></div></div></header>
  <div class="command-palette" id="commandPalette" role="dialog" aria-modal="true" aria-label="Command palette" aria-hidden="true">
    <div class="cp-panel">
      <div class="cp-header">
        <span class="cp-kbd">⌘K</span>
        <input class="cp-input" id="cpInput" placeholder="Search talent, routes, or type book Beyonce…" autocomplete="off" spellcheck="false">
        <button class="cp-kbd" id="cpClose" type="button" style="cursor:pointer;background:transparent">ESC</button>
      </div>
      <div class="cp-section" id="cpRoutes">
        <div class="cp-section-label">Quick routes</div>
        <a class="cp-item" data-cp-href="explorer.html"><span class="cp-item-icon">02</span><span>Explore Talents</span></a>
        <a class="cp-item" data-cp-href="booking.html"><span class="cp-item-icon">04</span><span>Initiate Engagement</span></a>
        <a class="cp-item" data-cp-href="crowdbooking.html"><span class="cp-item-icon">03</span><span>Crowd Access</span></a>
        <a class="cp-item" data-cp-href="portal.html"><span class="cp-item-icon">05</span><span>Client Portal</span></a>
      </div>
      <div class="cp-section" id="cpRecentSection" style="display:none">
        <div class="cp-section-label">Recent</div>
        <div id="cpRecentList"></div>
      </div>
      <div class="cp-section">
        <div class="cp-section-label">Roster matches</div>
        <div class="cp-results" id="cpResults"><div class="cp-empty">Type to search ${active === 'home' ? '166+' : ''} verified talents</div></div>
      </div>
    </div>
  </div>
  <div class="nav-overlay" id="navOverlay" role="dialog" aria-modal="true" aria-label="Site navigation">
    <button class="nov-close" id="navOverlayClose" aria-label="Close navigation">&#x2715; CLOSE</button>
    <nav class="nov-menu">
      <a class="nov-link${active==='home'?' nov-active':''}" href="index.html"><span class="nov-num">01</span><span class="nov-text"><span class="nov-title">Global Roster</span><span class="nov-sub">Featured access & live windows</span></span></a>
      <a class="nov-link${active==='explorer'?' nov-active':''}" href="explorer.html"><span class="nov-num">02</span><span class="nov-text"><span class="nov-title">Explore Talents</span><span class="nov-sub">Browse & compare profiles</span></span></a>
      <a class="nov-link${active==='crowd'?' nov-active':''}" href="crowdbooking.html"><span class="nov-num">03</span><span class="nov-text"><span class="nov-title">Crowd Access</span><span class="nov-sub">Group events & shared slots</span></span></a>
      <a class="nov-link${active==='booking'?' nov-active':''}" href="booking.html"><span class="nov-num">04</span><span class="nov-text"><span class="nov-title">Initiate Engagement</span><span class="nov-sub">Book private access</span></span></a>
      <a class="nov-link${active==='portal'?' nov-active':''}" href="portal.html"><span class="nov-num">05</span><span class="nov-text"><span class="nov-title">Client Portal</span><span class="nov-sub">Track bookings & messages</span></span></a>
      <a class="nov-link${active==='login'?' nov-active':''}" href="login.html"><span class="nov-num">06</span><span class="nov-text"><span class="nov-title">Secure Access</span><span class="nov-sub">Login & qualification</span></span></a>
    </nav>
    <div class="nov-footer"><span>All Talents Agency</span><span class="nov-footer-sep">·</span><span>NDA-protected · Escrow-secured</span></div>
  </div>`;
}

export function conciergeRail(){
  return `<aside class="concierge-rail">
    <h4>Client Service Concierge</h4>
    <p>Priority desk for high-value inquiries, first-meeting pathways, and executive coordination with representation teams.</p>
    <div class="concierge-actions">
      <a class="primary-action" href="explorer.html">Open Service Desk</a>
      <a href="login.html">Secure Access</a>
      <a href="booking.html">Start Booking Flow</a>
      <a href="portal.html">Client Portal</a>
    </div>
  </aside>`;
}

export function initTheme() {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('ata_theme', 'dark');
}

// ── CRYPTO PAYMENT WIDGET ────────────────────────────────────────────────────
const CRYPTO_WALLETS = {
  btc:  { name:'Bitcoin',  symbol:'BTC',  icon:'₿',  network:'Bitcoin Network (BTC)',      addr:'bc1qata9xv7k2mnp4z3wl8rdf6sd2xemvs3c8qkm7' },
  eth:  { name:'Ethereum', symbol:'ETH',  icon:'Ξ',  network:'Ethereum Network (ERC-20)',   addr:'0x3A9fC7E8b1D244F0C56A7E2cB9d0143eFa82BD5A' },
  usdt: { name:'Tether',   symbol:'USDT', icon:'₮',  network:'Tron Network (TRC-20)',       addr:'TATALntV5JFV8KdQmP3RnY7xB6wCzPoEHkL' },
  bnb:  { name:'BNB',      symbol:'BNB',  icon:'🟡', network:'BNB Smart Chain (BEP-20)',    addr:'0x3A9fC7E8b1D244F0C56A7E2cB9d0143eFa82BD5A' },
  sol:  { name:'Solana',   symbol:'SOL',  icon:'◎',  network:'Solana Network (SOL)',        addr:'ATAso1Vjk8QPnr4XbmELy7WZC6fT3HDgU9QSt2pR' },
  xrp:  { name:'XRP',      symbol:'XRP',  icon:'✦',  network:'XRP Ledger (XRPL)',           addr:'rATAxK7V9nL3Pm5qW4yBc1zTg8H6oEFdJuS' },
};

// Cosmetic QR grid pattern (11×11) — pre-built HTML string
const QR_PATTERN = (function(){
  const p = [1,1,1,1,1,1,1,0,1,0,1, 1,0,0,0,0,0,1,0,0,1,0, 1,0,1,1,1,0,1,0,1,1,1,
              1,0,1,1,1,0,1,0,0,0,1, 1,0,1,1,1,0,1,0,1,0,0, 1,0,0,0,0,0,1,0,0,1,1,
              1,1,1,1,1,1,1,0,1,0,1, 0,0,0,0,0,0,0,0,1,1,0, 1,1,0,1,0,1,1,0,0,1,1,
              0,1,1,0,0,1,0,0,1,0,1, 1,0,1,1,1,1,1,0,1,1,0];
  return p.map(b => `<div class='qr-cell${b?' qr-b':''}'></div>`).join('');
})();

export function buildCryptoPaymentHTML(uid = 'cp') {
  const coins = Object.entries(CRYPTO_WALLETS).map(([key, w]) =>
    `<div class='coin-pill${key==='btc'?' cp-active':''}' data-coin='${key}' data-uid='${uid}'>
      <span class='coin-icon'>${w.icon}</span>
      <span class='coin-name'>${w.symbol}</span>
      <span class='coin-label'>${w.name}</span>
    </div>`).join('');
  return `
    <div class='pay-method-tabs' id='${uid}-tabs'>
      <div class='pay-tab pt-active' data-tab='wire' data-uid='${uid}'>Wire / Bank Transfer</div>
      <div class='pay-tab pt-crypto' data-tab='crypto' data-uid='${uid}'>Cryptocurrency</div>
    </div>
    <div id='${uid}-wire' class='pay-detail-panel' data-uid='${uid}'>
      <div id='${uid}-wire-body' style='padding:14px;background:var(--bg-alt);border:1px solid var(--line);border-radius:8px'>
        <p style='font-weight:700;font-size:12px;color:var(--accent);margin:0 0 6px'>Wire Transfer Instructions</p>
        <p style='font-size:11px;color:var(--text-2);line-height:1.6;margin:0'>Bank details (SWIFT/IBAN) are issued after booking confirmation via the encrypted client portal. Funds are held in escrow and released upon milestone verification. Typical clearance: 2 banking days.</p>
      </div>
    </div>
    <div id='${uid}-crypto' class='crypto-section cs-visible'>
      <div class='coin-grid' style='display:grid;grid-template-columns:repeat(3,1fr)'>${coins}</div>
      <div id='${uid}-crypto-body' style='margin-top:12px'>
        <div class='crypto-wallet-wrap' style='padding:18px;background:rgba(247,147,26,.04);border:1px solid rgba(247,147,26,.2);border-radius:10px'>
          <div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:8px'>
            <div class='cw-network' id='${uid}-network' style='font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#f7931a;font-weight:700'>Bitcoin Network (BTC)</div>
          </div>
          <p style='font-size:10px;color:var(--muted);margin:0 0 10px;line-height:1.5'>Send the exact amount to the address below. Verify the network matches the selected coin before sending.</p>
          <div style='background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:14px;margin-bottom:10px'>
            <div style='font-size:9px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px;font-weight:600'>Deposit Address</div>
            <div style='font-family:Courier New,monospace;font-size:13px;color:#f7931a;word-break:break-all;line-height:1.5' id='${uid}-addr'>bc1qata9xv7k2mnp4z3wl8rdf6sd2xemvs3c8qkm7</div>
            <button class='crypto-copy-btn' id='${uid}-copy' style='margin-top:10px;width:100%;padding:10px;background:rgba(247,147,26,.08);border:1px solid rgba(247,147,26,.3);color:#f7931a;border-radius:6px;cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.05em;transition:all .2s'>Copy Address</button>
          </div>
          <div style='display:flex;justify-content:center;margin-bottom:8px'>
            <div class='crypto-qr' style='width:120px;height:120px'>${QR_PATTERN}</div>
          </div>
          <p style='text-align:center;font-size:9px;color:rgba(247,147,26,.4);margin:0 0 12px;letter-spacing:.06em'>SCAN TO VERIFY ADDRESS</p>
        </div>
        <div class='crypto-confirm-note' style='font-size:11px;color:var(--text-2);line-height:1.6;padding:12px 14px;background:var(--bg-alt);border-radius:8px;border-left:2px solid rgba(247,147,26,.45);margin-bottom:12px'>Send only the selected cryptocurrency on the correct network. Transactions on the wrong network may result in permanent loss of funds.</div>
      </div>
    </div>`;
}

export function initCryptoWidget(uid = 'cp', onMethodChange) {
  let activeCoin = 'btc';
  let activeTab  = 'wire';
  let wireCollapsed = false;
  let cryptoCollapsed = false;

  const wirePanel   = document.getElementById(`${uid}-wire`);
  const cryptoPanel = document.getElementById(`${uid}-crypto`);
  const addrEl      = document.getElementById(`${uid}-addr`);
  const networkEl   = document.getElementById(`${uid}-network`);
  const copyBtn     = document.getElementById(`${uid}-copy`);

  // Wire toggle (collapsible)
  const wireToggle = document.getElementById(`${uid}-wire-toggle`);
  const wireBody = document.getElementById(`${uid}-wire-body`);
  const wireChevron = document.getElementById(`${uid}-wire-chevron`);
  if (wireToggle && wireBody) {
    wireToggle.addEventListener('click', () => {
      wireCollapsed = !wireCollapsed;
      wireBody.style.display = wireCollapsed ? 'none' : '';
      if (wireChevron) wireChevron.style.transform = wireCollapsed ? 'rotate(-90deg)' : '';
    });
  }

  // Crypto toggle (collapsible)
  const cryptoToggle = document.getElementById(`${uid}-crypto-toggle`);
  const cryptoBody = document.getElementById(`${uid}-crypto-body`);
  const cryptoChevron = document.getElementById(`${uid}-crypto-chevron`);
  if (cryptoToggle && cryptoBody) {
    cryptoToggle.addEventListener('click', () => {
      cryptoCollapsed = !cryptoCollapsed;
      cryptoBody.style.display = cryptoCollapsed ? 'none' : '';
      if (cryptoChevron) cryptoChevron.style.transform = cryptoCollapsed ? 'rotate(-90deg)' : '';
    });
  }

  // Tab switching
  document.querySelectorAll(`#${uid}-tabs .pay-tab`).forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll(`#${uid}-tabs .pay-tab`).forEach(t => t.classList.remove('pt-active'));
      tab.classList.add('pt-active');
      activeTab = tab.dataset.tab;
      if (activeTab === 'wire') {
        wirePanel.style.display = '';
        cryptoPanel.classList.remove('cs-visible');
        onMethodChange?.('wire');
      } else {
        wirePanel.style.display = 'none';
        cryptoPanel.classList.add('cs-visible');
        onMethodChange?.(activeCoin);
      }
    });
  });

  // Coin selection
  document.querySelectorAll(`#${uid}-crypto .coin-pill`).forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll(`#${uid}-crypto .coin-pill`).forEach(p => p.classList.remove('cp-active'));
      pill.classList.add('cp-active');
      activeCoin = pill.dataset.coin;
      const w = CRYPTO_WALLETS[activeCoin];
      networkEl.textContent = w.network;
      addrEl.textContent    = w.addr;
      copyBtn.textContent   = 'Copy';
      copyBtn.classList.remove('copied');
      if (activeTab === 'crypto') onMethodChange?.(activeCoin);
    });
  });

  // Copy address
  copyBtn?.addEventListener('click', async () => {
    const addr = addrEl?.textContent || '';
    try { await navigator.clipboard.writeText(addr); } catch { /* fallback */ }
    copyBtn.textContent = '✓ Copied!';
    copyBtn.classList.add('copied');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2500);
  });

  return { getMethod: () => activeTab === 'wire' ? 'wire' : activeCoin };
}

// ── FULLSCREEN NAV OVERLAY ─────────────────────────────────────────────
export function initNav() {
  const overlay = document.getElementById('navOverlay');
  const openBtn = document.getElementById('navAccessBtn');
  const closeBtn = document.getElementById('navOverlayClose');
  if (!overlay || !openBtn) return;

  function openNav() {
    overlay.classList.add('nov-open');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    overlay.querySelectorAll('.nov-link').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(-24px)';
      setTimeout(() => {
        el.style.transition = 'opacity .4s ease, transform .4s ease';
        el.style.opacity = '';
        el.style.transform = '';
      }, 80 + i * 70);
    });
  }

  function closeNav() {
    overlay.classList.remove('nov-open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openNav);
  closeBtn?.addEventListener('click', closeNav);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeNav(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      const localSearch = document.getElementById('search');
      if (localSearch) { e.preventDefault(); localSearch.focus(); }
    }
  });
}

export function initCommandPalette(roster = []) {
  const palette = document.getElementById('commandPalette');
  const input = document.getElementById('cpInput');
  const results = document.getElementById('cpResults');
  const recentSection = document.getElementById('cpRecentSection');
  const recentList = document.getElementById('cpRecentList');
  const searchBtn = document.getElementById('navSearchBtn');
  const closeBtn = document.getElementById('cpClose');
  if (!palette || !input || !results) return;

  let activeIdx = -1;
  let currentItems = [];

  function renderRecent() {
    const recent = getRecentViews();
    if (!recent.length || !recentSection || !recentList) return;
    recentSection.style.display = '';
    recentList.innerHTML = recent.map(r => {
      const c = roster.find(x => x.id === r.id);
      const name = c?.name || r.name || r.id;
      return `<a class="cp-item" data-cp-href="talent.html?id=${r.id}"><span class="cp-item-icon">↺</span><span>${name}</span><span class="cp-item-meta">${r.id}</span></a>`;
    }).join('');
    recentList.querySelectorAll('[data-cp-href]').forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); go(el.dataset.cpHref); });
    });
  }

  function renderResults(q) {
    const intent = parsePaletteIntent(q, roster);
    const matches = paletteSearchRoster(q, roster, 8);
    currentItems = [];
    let html = '';
    if (intent && intent.type === 'route') {
      html += `<a class="cp-item cp-active" data-cp-href="${intent.href}"><span class="cp-item-icon">→</span><span>Go to ${intent.label}</span></a>`;
      currentItems.push(intent.href);
    } else if (intent && (intent.type === 'dossier' || intent.type === 'book' || intent.type === 'path' || intent.type === 'hold')) {
      const icons = { book: 'B', dossier: 'D', path: 'P', hold: 'H' };
      const labels = { book: 'Book', dossier: 'Open dossier', path: 'Access path', hold: 'Hold window' };
      const holdAttrs = intent.type === 'hold' && intent.celeb
        ? ` data-cp-action="hold" data-cp-id="${intent.celeb.id}" data-cp-name="${(intent.celeb.name || '').replace(/"/g, '&quot;')}"`
        : '';
      const pathAttrs = intent.type === 'path' ? ' data-cp-action="path"' : '';
      html += `<a class="cp-item cp-active"${holdAttrs}${pathAttrs} data-cp-href="${intent.href}"><span class="cp-item-icon">${icons[intent.type] || '→'}</span><span>${labels[intent.type] || intent.type}${intent.celeb ? ': ' + intent.celeb.name : ''}</span><span class="cp-item-meta">${intent.celeb ? formatPrice(intent.celeb.startingPrice) : ''}</span></a>`;
      currentItems.push(intent.type === 'hold' ? 'hold' : intent.href);
    } else if (intent && intent.type === 'qualify') {
      html += `<a class="cp-item cp-active" data-cp-action="qualify"><span class="cp-item-icon">Q</span><span>Start client qualification</span></a>`;
      currentItems.push('qualify');
    } else if (intent && intent.type === 'search') {
      html += `<a class="cp-item cp-active" data-cp-href="${intent.href}"><span class="cp-item-icon">⌕</span><span>Search roster for "${q.trim()}"</span></a>`;
      currentItems.push(intent.href);
    }
    matches.forEach((c, i) => {
      const href = `talent.html?id=${c.id}`;
      html += `<a class="cp-item${!html && i === 0 ? ' cp-active' : ''}" data-cp-href="${href}" data-cp-book="booking.html?id=${c.id}"><span class="cp-item-icon">${(c.name[0] || 'T').toUpperCase()}</span><span>${c.name}</span><span class="cp-item-meta">${c.category} · ${formatPrice(c.startingPrice)}</span></a>`;
      if (!currentItems.length) currentItems.push(href);
      currentItems.push(href);
    });
    if (!html) {
      results.innerHTML = `<div class="cp-empty">${q.trim() ? 'No matches — try a route name or celebrity' : 'Type to search verified talents'}</div>`;
      return;
    }
    results.innerHTML = html;
    activeIdx = 0;
    results.querySelectorAll('.cp-item').forEach((el, idx) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (el.dataset.cpAction === 'qualify') {
          closePalette();
          openQualifyModal('');
          return;
        }
        if (el.dataset.cpAction === 'hold') {
          closePalette();
          triggerWindowHold(el.dataset.cpId, el.dataset.cpName);
          return;
        }
        if (el.dataset.cpAction === 'path') {
          closePalette();
          const href = el.dataset.cpHref || '';
          if (href.includes('#')) {
            const hash = href.split('#')[1];
            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
          go(href);
          return;
        }
        if (e.shiftKey && el.dataset.cpBook) go(el.dataset.cpBook);
        else go(el.dataset.cpHref);
      });
      if (idx === 0) el.classList.add('cp-active');
    });
  }

  function go(href) {
    if (!href) return;
    closePalette();
    window.location.href = href;
  }

  function openPalette() {
    palette.classList.add('cp-open');
    palette.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderRecent();
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 40);
  }

  function closePalette() {
    palette.classList.remove('cp-open');
    palette.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeIdx = -1;
  }

  searchBtn?.addEventListener('click', openPalette);
  closeBtn?.addEventListener('click', closePalette);
  palette.addEventListener('click', (e) => { if (e.target === palette) closePalette(); });

  input.addEventListener('input', () => renderResults(input.value));
  input.addEventListener('keydown', (e) => {
    const items = [...results.querySelectorAll('.cp-item')];
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('cp-active', i === activeIdx));
      items[activeIdx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      items.forEach((el, i) => el.classList.toggle('cp-active', i === activeIdx));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const active = items[activeIdx] || items[0];
      if (active?.dataset.cpAction === 'qualify') {
        closePalette();
        openQualifyModal('');
        return;
      }
      if (active?.dataset.cpAction === 'hold') {
        closePalette();
        triggerWindowHold(active.dataset.cpId, active.dataset.cpName);
        return;
      }
      if (active?.dataset.cpAction === 'path') {
        closePalette();
        const href = active.dataset.cpHref || '';
        if (href.includes('#')) {
          document.getElementById(href.split('#')[1])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else go(href);
        return;
      }
      if (active) go(active.dataset.cpHref);
      else {
        const intent = parsePaletteIntent(input.value, roster);
        if (intent) go(intent.href);
      }
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  document.querySelectorAll('#cpRoutes [data-cp-href]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); go(el.dataset.cpHref); });
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette.classList.contains('cp-open')) closePalette();
      else openPalette();
    }
  });
}

export function setCategoryTint(category) {
  if (!category) return;
  document.body.setAttribute('data-category', category);
}

export function initScrollMotion() {
  if (window.__ataScrollMotion) return;
  window.__ataScrollMotion = true;
  document.documentElement.classList.add('is-loaded');

  const bar = document.getElementById('scrollProgress');
  const update = () => {
    if (!bar) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : '0%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();

  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const rate = Number(el.dataset.parallax) || 0.025;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const shift = (window.innerHeight / 2 - rect.top) * rate;
      el.style.transform = `translate3d(0,${shift.toFixed(2)}px,0)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  document.querySelectorAll('.scroll-stay').forEach((el) => {
    const parent = el.parentElement;
    if (!parent) return;
    parent.style.position = 'relative';
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle('scroll-stay-active', entry.intersectionRatio > 0.35);
    }, { threshold: [0, 0.35, 0.6] });
    io.observe(el);
  });
}

export function initScrollReveal() {
  initScrollMotion();
  document.querySelectorAll('.reveal-on-scroll.persist-visible').forEach(el => el.classList.add('revealed'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      if (e.target.classList.contains('persist-visible')) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
        return;
      }
      const delay = Number(e.target.dataset.revealDelay) || 0;
      setTimeout(() => {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }, delay);
    });
  }, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    if (el.classList.contains('persist-visible')) el.classList.add('revealed');
    else io.observe(el);
  });
}

export function initDynamicTheme() {
  const h = new Date().getHours();
  const period = h >= 22 || h < 6 ? 'night' : h < 10 ? 'morning' : h < 18 ? 'day' : 'evening';
  document.documentElement.setAttribute('data-time-period', period);
  const chip = document.getElementById('deskStatusText');
  if (chip) {
    const labels = {
      night: 'After-hours desk · UTC',
      morning: 'Morning desks opening',
      day: 'Live desks open',
      evening: 'Event windows active',
    };
    chip.textContent = labels[period] || 'Live desks';
  }
}

export function initFlipFilter(containerSel, itemSel) {
  return function flip(filterFn) {
    const container = document.querySelector(containerSel);
    if (!container) return;
    const items = [...container.querySelectorAll(itemSel)];
    const firsts = new Map(items.map(el => [el, el.getBoundingClientRect()]));
    items.forEach(el => { el.style.display = filterFn(el) ? '' : 'none'; });
    items.forEach(el => {
      if (el.style.display === 'none') return;
      const first = firsts.get(el);
      const last = el.getBoundingClientRect();
      if (!first) return;
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (Math.abs(dx) + Math.abs(dy) < 1) return;
      el.animate(
        [{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'translate(0,0)' }],
        { duration: 380, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'none' }
      );
    });
  };
}

export async function loadTicker() {
  let track = document.getElementById('tickerTrack');
  if (!track) {
    const navEl = document.querySelector('.nav');
    if (navEl) {
      const outer = document.createElement('div');
      outer.className = 'ticker-outer';
      outer.innerHTML = '<div class="ticker-track" id="tickerTrack"><span class="tick-item muted">Loading market intelligence...</span></div>';
      navEl.insertAdjacentElement('afterend', outer);
      track = document.getElementById('tickerTrack');
    }
  }
  if (!track) return;
  try {
    const { events } = await request('/intelligence/ticker');
    if (!events?.length) return;
    const items = events.map(e =>
      `<span class="tick-item ${e.positive ? 'tick-up' : 'tick-down'}">${e.name} <b>· ${e.event}</b> ${e.change}</span><span class="tick-sep">◆</span>`
    ).join('');
    track.innerHTML = items + items;
  } catch { /* silent */ }
}

export function triggerConfirmPulse(el) {
  if (!el?.animate) return;
  el.animate(
    [
      { transform: 'scale(1)', boxShadow: '0 0 0 rgba(159,230,176,0)' },
      { transform: 'scale(1.02)', boxShadow: '0 0 24px rgba(159,230,176,0.35)' },
      { transform: 'scale(1)', boxShadow: '0 0 0 rgba(159,230,176,0)' },
    ],
    { duration: 600, easing: 'ease-out' }
  );
}

export function initScrollProgress() {
  initScrollMotion();
}
