"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { authHeaders, fetchJson, getAuthToken } from "../../lib/api";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const CC = ["#94B4D8","#6B93BD","#4A74A0","#B8CDE0","#D0E1EF","#3A5A7E"];
const STAGES = ["Inquiry Received","Under Representation Review","Terms Negotiation","Contract Finalized","Escrow Secured","Confirmed"];
const fmtMoney = (n) => n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : `$${Math.round(n/1000)}K`;
const fmtD = (s) => s ? new Date(s).toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "-";
const stageColor = (s) => ({"Confirmed":"#4ade80","Escrow Secured":"#94B4D8","Contract Finalized":"#a78bfa","Terms Negotiation":"#fbbf24","Under Representation Review":"#fb923c"}[s]||"#94a3b8");
const availColor = (a) => ({Open:"#4ade80",Limited:"#fbbf24",Waitlist:"#fb923c"}[a]||"#94a3b8");

const PALETTE_CMDS = [
  { id:"overview",  label:"Go to Overview",     desc:"KPIs & charts",         action:"tab:overview" },
  { id:"bookings",  label:"Go to Bookings",      desc:"All bookings",          action:"tab:bookings" },
  { id:"users",     label:"Go to Users",         desc:"Manage users",          action:"tab:users" },
  { id:"celebs",    label:"Go to Celebrities",   desc:"Edit talent roster",    action:"tab:celebrities" },
  { id:"broadcast", label:"Go to Broadcast",     desc:"Send to all users",     action:"tab:broadcast" },
  { id:"audit",     label:"Go to Audit Log",     desc:"Full action trail",     action:"tab:audit" },
  { id:"refresh",   label:"Refresh All Data",    desc:"Re-fetch everything",   action:"refresh" },
  { id:"livefeed",  label:"Toggle Live Feed",    desc:"Show/hide notif panel", action:"notif" },
  { id:"logout",    label:"Logout",              desc:"Clear session & exit",  action:"logout" },
];

const S = {
  page: { minHeight: "100vh", background: "#070A14", color: "#E6ECF4", fontFamily: "'Inter', system-ui, sans-serif" },
  header: { background: "rgba(148,180,216,0.04)", borderBottom: "1px solid rgba(148,180,216,0.12)", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  headerLeft: { display: "flex", alignItems: "center", gap: 14 },
  logo: { width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#94B4D8,#4A74A0)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#070A14", flexShrink: 0 },
  title: { fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", color: "#94B4D8", textTransform: "uppercase" },
  subtitle: { fontSize: 10, color: "rgba(230,236,244,0.45)", letterSpacing: "0.1em" },
  notifBell: { position: "relative", cursor: "pointer", background: "rgba(148,180,216,0.08)", border: "1px solid rgba(148,180,216,0.18)", borderRadius: 10, padding: "8px 12px", fontSize: 13, color: "#E6ECF4", display: "flex", alignItems: "center", gap: 7 },
  badge: { position: "absolute", top: -6, right: -6, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  authBar: { fontSize: 12, color: "rgba(230,236,244,0.5)", display: "flex", alignItems: "center", gap: 8 },
  body: { maxWidth: 1400, margin: "0 auto", padding: "24px 24px 60px" },
  tabs: { display: "flex", gap: 4, marginBottom: 28, borderBottom: "1px solid rgba(148,180,216,0.1)", paddingBottom: 0, flexWrap: "wrap" },
  tab: (active) => ({ padding: "10px 18px", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", border: "none", background: "none", color: active ? "#94B4D8" : "rgba(230,236,244,0.4)", borderBottom: active ? "2px solid #94B4D8" : "2px solid transparent", transition: "all .18s ease", marginBottom: -1 }),
  kpiGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(155px,1fr))", gap: 14, marginBottom: 28 },
  kpiCard: { background: "rgba(148,180,216,0.05)", border: "1px solid rgba(148,180,216,0.12)", borderRadius: 14, padding: "18px 20px" },
  kpiLabel: { fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(148,180,216,0.7)", marginBottom: 8 },
  kpiValue: { fontSize: 26, fontWeight: 700, color: "#94B4D8" },
  chartGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))", gap: 16, marginBottom: 28 },
  chartCard: { background: "rgba(148,180,216,0.04)", border: "1px solid rgba(148,180,216,0.1)", borderRadius: 16, padding: "20px" },
  chartTitle: { fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(148,180,216,0.7)", marginBottom: 16 },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12 },
  th: { textAlign: "left", padding: "10px 14px", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(148,180,216,0.6)", borderBottom: "1px solid rgba(148,180,216,0.1)" },
  td: { padding: "12px 14px", borderBottom: "1px solid rgba(148,180,216,0.06)", verticalAlign: "middle" },
  pill: (color) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", background: `${color}22`, color, border: `1px solid ${color}55` }),
  btn: { cursor: "pointer", border: "1px solid rgba(148,180,216,0.25)", borderRadius: 8, padding: "5px 12px", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", background: "rgba(148,180,216,0.07)", color: "#94B4D8", transition: "all .15s ease" },
  btnDanger: { cursor: "pointer", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "5px 12px", fontSize: 10, fontWeight: 600, background: "rgba(239,68,68,0.07)", color: "#ef4444", transition: "all .15s ease" },
  btnGhost: { cursor: "pointer", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 8, padding: "5px 12px", fontSize: 10, fontWeight: 600, background: "rgba(167,139,250,0.07)", color: "#a78bfa", transition: "all .15s ease" },
  section: { background: "rgba(148,180,216,0.03)", border: "1px solid rgba(148,180,216,0.09)", borderRadius: 18, padding: "22px 24px", marginBottom: 18 },
  notifPanel: { position: "fixed", top: 0, right: 0, bottom: 0, width: 360, background: "#0C1120", borderLeft: "1px solid rgba(148,180,216,0.15)", zIndex: 100, display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.6)" },
  notifHeader: { padding: "20px 20px 14px", borderBottom: "1px solid rgba(148,180,216,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  paletteOverlay: { position: "fixed", inset: 0, background: "rgba(7,10,20,0.85)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "18vh" },
  paletteBox: { background: "#0C1120", border: "1px solid rgba(148,180,216,0.25)", borderRadius: 16, width: "100%", maxWidth: 560, boxShadow: "0 24px 80px rgba(0,0,0,0.7)" },
  paletteInput: { width: "100%", background: "none", border: "none", borderBottom: "1px solid rgba(148,180,216,0.12)", padding: "18px 20px", fontSize: 15, color: "#E6ECF4", outline: "none", boxSizing: "border-box" },
  paletteItem: (active) => ({ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", cursor: "pointer", background: active ? "rgba(148,180,216,0.08)" : "none", transition: "background .1s" }),
  select: { background: "#0C1120", border: "1px solid rgba(148,180,216,0.2)", borderRadius: 7, padding: "4px 8px", fontSize: 10, color: "#94B4D8", cursor: "pointer", outline: "none" },
  input: { background: "rgba(148,180,216,0.06)", border: "1px solid rgba(148,180,216,0.2)", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#E6ECF4", outline: "none" },
  notifItem: { padding: "14px 18px", borderBottom: "1px solid rgba(148,180,216,0.07)", fontSize: 12 },
  gate: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 16 },
};

export default function GodModeAdmin() {
  const [authed, setAuthed] = useState(null);
  const [tab, setTab] = useState("overview");
  const [dash, setDash] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [audit, setAudit] = useState([]);
  const [celebs, setCelebs] = useState([]);
  const [celebTotal, setCelebTotal] = useState(0);
  const [celebPage, setCelebPage] = useState(1);
  const [editingCeleb, setEditingCeleb] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkStage, setBulkStage] = useState(STAGES[1]);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [unread, setUnread] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQ, setPaletteQ] = useState("");
  const [paletteIdx, setPaletteIdx] = useState(0);
  const paletteInputRef = useRef(null);
  const sseRef = useRef(null);

  // Auth check
  useEffect(() => {
    const token = getAuthToken();
    if (!token) { setAuthed(false); return; }
    try {
      const stored = JSON.parse(localStorage.getItem("aurelux_user") || "null");
      if (stored?.role === "admin") { setAuthed(true); return; }
    } catch (_) {}
    fetchJson("/auth/me", { headers: authHeaders() })
      .then((d) => { if (d.user?.role === "admin") setAuthed(true); else setAuthed(false); })
      .catch(() => setAuthed(false));
  }, []);

  // Ctrl+K Command Palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPaletteOpen((o) => { if (!o) { setPaletteQ(""); setPaletteIdx(0); } return !o; }); }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => { if (paletteOpen) setTimeout(() => paletteInputRef.current?.focus(), 50); }, [paletteOpen]);

  // SSE live feed
  useEffect(() => {
    if (!authed) return;
    const token = getAuthToken();
    const es = new EventSource(`${API}/admin/events?token=${token}`);
    sseRef.current = es;
    es.onmessage = (e) => {
      try {
        const evt = JSON.parse(e.data);
        if (evt.type === "CONNECTED") return;
        setNotifications((prev) => [evt, ...prev].slice(0, 50));
        setUnread((n) => n + 1);
        if (["NEW_BOOKING","BOOKING_CANCELLED","BOOKING_STATUS_UPDATED","BULK_ACTION"].includes(evt.type)) loadBookings();
        if (["USER_SUSPENDED","USER_UNSUSPENDED"].includes(evt.type)) loadUsers();
        if (evt.type === "CELEBRITY_AVAILABILITY_CHANGED") loadCelebs(1);
      } catch (_) {}
    };
    return () => es.close();
  }, [authed]);

  const loadDash     = useCallback(() => fetchJson("/admin/dashboard",  { headers: authHeaders() }).then(setDash).catch(console.error), []);
  const loadBookings = useCallback(() => fetchJson("/admin/bookings",   { headers: authHeaders() }).then((r) => setBookings(r.data || [])).catch(console.error), []);
  const loadUsers    = useCallback(() => fetchJson("/admin/users",      { headers: authHeaders() }).then((r) => setUsers(r.data || [])).catch(console.error), []);
  const loadAudit    = useCallback(() => fetchJson("/admin/audit",      { headers: authHeaders() }).then((r) => setAudit(r.data || [])).catch(console.error), []);
  const loadSessions = useCallback(() => fetchJson("/admin/sessions",   { headers: authHeaders() }).then((r) => setSessions(r.adminSessions || 0)).catch(() => {}), []);
  const loadCelebs   = useCallback((page = 1) => {
    fetchJson(`/admin/celebrities?page=${page}&limit=20`, { headers: authHeaders() })
      .then((r) => { setCelebs(r.data || []); setCelebTotal(r.total || 0); setCelebPage(page); }).catch(console.error);
  }, []);

  const refreshAll = useCallback(() => {
    loadDash(); loadBookings(); loadUsers(); loadAudit(); loadCelebs(1); loadSessions();
  }, [loadDash, loadBookings, loadUsers, loadAudit, loadCelebs, loadSessions]);

  useEffect(() => {
    if (!authed) return;
    refreshAll();
    const t = setInterval(loadSessions, 15000);
    return () => clearInterval(t);
  }, [authed]);

  // Actions
  const advanceBooking   = async (id, stage) => { await fetchJson(`/admin/bookings/${id}/status`, { method:"PATCH", headers:authHeaders(), body:JSON.stringify({ stage }) }); loadBookings(); loadDash(); };
  const cancelBooking    = async (id) => { if (!confirm("Cancel and delete this booking?")) return; await fetchJson(`/admin/bookings/${id}`, { method:"DELETE", headers:authHeaders() }); loadBookings(); loadDash(); };
  const suspendUser      = async (id, suspend) => { await fetchJson(`/admin/users/${id}/${suspend?"suspend":"unsuspend"}`, { method:"POST", headers:authHeaders() }); loadUsers(); };
  const flipAvailability = async (id) => { await fetchJson(`/admin/celebrities/${id}/availability`, { method:"PATCH", headers:authHeaders() }); loadCelebs(celebPage); };
  const saveCelebEdit    = async (id, field, value) => { await fetchJson(`/admin/celebrities/${id}`, { method:"PATCH", headers:authHeaders(), body:JSON.stringify({ [field]: value }) }); setEditingCeleb(null); loadCelebs(celebPage); };
  const bulkAction       = async (action) => { if (!selectedIds.size) return; await fetchJson("/admin/bookings/bulk", { method:"POST", headers:authHeaders(), body:JSON.stringify({ ids:Array.from(selectedIds), action, stage:bulkStage }) }); setSelectedIds(new Set()); loadBookings(); loadDash(); };
  const sendBroadcast    = async () => { if (!broadcastMsg.trim()) return; const r = await fetchJson("/admin/broadcast", { method:"POST", headers:authHeaders(), body:JSON.stringify({ message:broadcastMsg }) }); setBroadcastResult(r); setBroadcastMsg(""); loadAudit(); };
  const impersonate      = async (id) => { const r = await fetchJson(`/admin/impersonate/${id}`, { method:"POST", headers:authHeaders() }); localStorage.setItem("aurelux_token", r.token); localStorage.setItem("aurelux_user", JSON.stringify(r.user)); window.open("/", "_blank"); };
  const toggleSelect     = (id) => setSelectedIds((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll        = () => setSelectedIds((p) => p.size === bookings.length ? new Set() : new Set(bookings.map((b) => b.id)));

  const runPaletteAction = (action) => {
    setPaletteOpen(false);
    if (action.startsWith("tab:")) { setTab(action.slice(4)); return; }
    if (action === "refresh") { refreshAll(); return; }
    if (action === "notif")   { setShowNotif((v) => !v); setUnread(0); return; }
    if (action === "logout")  { localStorage.removeItem("aurelux_token"); localStorage.removeItem("aurelux_user"); window.location.href = "/login"; }
  };
  const paletteFiltered = PALETTE_CMDS.filter((c) => !paletteQ || c.label.toLowerCase().includes(paletteQ.toLowerCase()) || c.desc.toLowerCase().includes(paletteQ.toLowerCase()));

  const notifLabel = (type) => ({
    "NEW_BOOKING":                    { label:"NEW BOOKING",     color:"#4ade80" },
    "BOOKING_CANCELLED":              { label:"CANCELLED",       color:"#ef4444" },
    "BOOKING_STATUS_UPDATED":         { label:"STATUS CHANGE",   color:"#94B4D8" },
    "USER_SUSPENDED":                 { label:"USER SUSPENDED",  color:"#fb923c" },
    "USER_UNSUSPENDED":               { label:"USER RESTORED",   color:"#a78bfa" },
    "BROADCAST":                      { label:"BROADCAST SENT",  color:"#fbbf24" },
    "BULK_ACTION":                    { label:"BULK ACTION",     color:"#94B4D8" },
    "USER_IMPERSONATED":              { label:"IMPERSONATION",   color:"#f472b6" },
    "CELEBRITY_AVAILABILITY_CHANGED": { label:"AVAIL CHANGED",   color:"#4ade80" },
  }[type] || { label: type, color: "#94a3b8" });

  // Auth gates
  if (authed === null) return <div style={{ ...S.gate, ...S.page }}><div style={{ color:"#94B4D8", fontSize:13, letterSpacing:"0.12em" }}>VERIFYING ACCESS...</div></div>;
  if (authed === false) return (
    <div style={{ ...S.gate, ...S.page }}>
      <div style={{ ...S.logo, width:52, height:52, borderRadius:14, fontSize:24 }}>A</div>
      <div style={{ fontSize:13, letterSpacing:"0.18em", color:"#94B4D8", textTransform:"uppercase" }}>RESTRICTED ACCESS</div>
      <div style={{ fontSize:12, color:"rgba(230,236,244,0.45)" }}>Admin credentials required</div>
      <a href="/login" style={{ marginTop:8, fontSize:12, color:"#94B4D8", textDecoration:"underline" }}>Go to login</a>
    </div>
  );

  return (
    <div style={S.page}>

      {/* COMMAND PALETTE */}
      {paletteOpen && (
        <div style={S.paletteOverlay} onClick={() => setPaletteOpen(false)}>
          <div style={S.paletteBox} onClick={(e) => e.stopPropagation()}>
            <input ref={paletteInputRef} style={S.paletteInput} placeholder="Type a command..." value={paletteQ}
              onChange={(e) => { setPaletteQ(e.target.value); setPaletteIdx(0); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") setPaletteIdx((i) => Math.min(i+1, paletteFiltered.length-1));
                if (e.key === "ArrowUp")   setPaletteIdx((i) => Math.max(i-1, 0));
                if (e.key === "Enter" && paletteFiltered[paletteIdx]) runPaletteAction(paletteFiltered[paletteIdx].action);
                if (e.key === "Escape") setPaletteOpen(false);
              }} />
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {paletteFiltered.map((cmd, i) => (
                <div key={cmd.id} style={S.paletteItem(i === paletteIdx)} onMouseEnter={() => setPaletteIdx(i)} onClick={() => runPaletteAction(cmd.action)}>
                  <div>
                    <div style={{ fontSize:13, color:"#E6ECF4", fontWeight:500 }}>{cmd.label}</div>
                    <div style={{ fontSize:10, color:"rgba(230,236,244,0.4)", marginTop:1 }}>{cmd.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding:"10px 20px", borderTop:"1px solid rgba(148,180,216,0.08)", fontSize:10, color:"rgba(230,236,244,0.25)", display:"flex", gap:16 }}>
              <span>Up/Down to navigate</span><span>Enter to select</span><span>Esc to close</span>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.logo}>A</div>
          <div>
            <div style={S.title}>God Mode Command</div>
            <div style={S.subtitle}>All Talents Agency - Admin Panel</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <div style={S.authBar}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", display:"inline-block" }} />
            admin@aurelux.com
          </div>
          <div style={{ ...S.authBar, gap:5 }}>
            <span style={{ fontSize:10, color:"rgba(148,180,216,0.5)" }}>SESSIONS</span>
            <span style={{ color:"#94B4D8", fontWeight:700 }}>{sessions}</span>
          </div>
          <button style={S.btn} onClick={() => { setPaletteOpen(true); setPaletteQ(""); setPaletteIdx(0); }}>Ctrl+K Command</button>
          <div style={S.notifBell} onClick={() => { setShowNotif(!showNotif); setUnread(0); }}>
            Live Feed
            {unread > 0 && <span style={S.badge}>{unread > 9 ? "9+" : unread}</span>}
          </div>
          <a href="http://localhost:3000" target="_blank" rel="noreferrer" style={{ fontSize:11, color:"rgba(230,236,244,0.35)", textDecoration:"none" }}>Main Site</a>
        </div>
      </header>

      {/* BODY */}
      <div style={S.body}>
        <div style={S.tabs}>
          {[["overview","Overview"],["bookings","Bookings"],["users","Users"],["celebrities","Celebrities"],["broadcast","Broadcast"],["audit","Audit Log"]].map(([id, label]) => (
            <button key={id} style={S.tab(tab === id)} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && dash && (
          <>
            <div style={S.kpiGrid}>
              <div style={S.kpiCard}><div style={S.kpiLabel}>Revenue YTD</div><div style={S.kpiValue}>{fmtMoney(dash.kpis.revenueYTD)}</div></div>
              <div style={S.kpiCard}><div style={S.kpiLabel}>Active Bookings</div><div style={S.kpiValue}>{bookings.length}</div></div>
              <div style={S.kpiCard}><div style={S.kpiLabel}>Avg Escrow %</div><div style={S.kpiValue}>{dash.kpis.avgEscrowPercent}%</div></div>
              <div style={S.kpiCard}><div style={S.kpiLabel}>Admin Sessions</div><div style={S.kpiValue}>{sessions}</div></div>
              <div style={S.kpiCard}><div style={S.kpiLabel}>Live Notifs</div><div style={S.kpiValue}>{notifications.length}</div></div>
              <div style={S.kpiCard}><div style={S.kpiLabel}>Total Users</div><div style={S.kpiValue}>{users.length}</div></div>
              <div style={S.kpiCard}><div style={S.kpiLabel}>Celebrities</div><div style={S.kpiValue}>{celebTotal}</div></div>
              <div style={S.kpiCard}><div style={S.kpiLabel}>Audit Entries</div><div style={S.kpiValue}>{audit.length}</div></div>
            </div>
            <div style={S.chartGrid}>
              <div style={S.chartCard}>
                <div style={S.chartTitle}>Revenue Over Time</div>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dash.charts.revenueSeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,180,216,0.08)" />
                      <XAxis dataKey="month" stroke="rgba(148,180,216,0.4)" tick={{ fontSize:10 }} />
                      <YAxis stroke="rgba(148,180,216,0.4)" tick={{ fontSize:10 }} tickFormatter={(v) => `$${v/1e6}M`} />
                      <Tooltip contentStyle={{ background:"#0C1120", border:"1px solid rgba(148,180,216,0.2)", borderRadius:8, fontSize:11 }} />
                      <Area type="monotone" dataKey="revenue" stroke="#94B4D8" fill="#94B4D820" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={S.chartCard}>
                <div style={S.chartTitle}>Distribution by Category</div>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dash.charts.distribution} dataKey="count" nameKey="category" outerRadius={85} innerRadius={40}>
                        {dash.charts.distribution.map((e, i) => <Cell key={e.category} fill={CC[i % CC.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background:"#0C1120", border:"1px solid rgba(148,180,216,0.2)", borderRadius:8, fontSize:11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={S.chartCard}>
                <div style={S.chartTitle}>Most Requested Celebrities</div>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dash.charts.requested}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,180,216,0.08)" />
                      <XAxis dataKey="name" stroke="rgba(148,180,216,0.4)" tick={{ fontSize:9 }} hide />
                      <YAxis stroke="rgba(148,180,216,0.4)" tick={{ fontSize:10 }} />
                      <Tooltip contentStyle={{ background:"#0C1120", border:"1px solid rgba(148,180,216,0.2)", borderRadius:8, fontSize:11 }} />
                      <Bar dataKey="requests" fill="#94B4D8" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={S.chartCard}>
                <div style={S.chartTitle}>Regional Demand Intensity</div>
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dash.charts.regional}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,180,216,0.08)" />
                      <XAxis dataKey="region" stroke="rgba(148,180,216,0.4)" tick={{ fontSize:9 }} />
                      <YAxis stroke="rgba(148,180,216,0.4)" tick={{ fontSize:10 }} />
                      <Tooltip contentStyle={{ background:"#0C1120", border:"1px solid rgba(148,180,216,0.2)", borderRadius:8, fontSize:11 }} />
                      <Bar dataKey="intensity" fill="#6B93BD" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}

        {/* BOOKINGS */}
        {tab === "bookings" && (
          <div style={S.section}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
              <div style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(148,180,216,0.7)" }}>All Bookings - {bookings.length} total</div>
              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                {selectedIds.size > 0 && (<>
                  <span style={{ fontSize:11, color:"#94B4D8" }}>{selectedIds.size} selected</span>
                  <select style={S.select} value={bulkStage} onChange={(e) => setBulkStage(e.target.value)}>
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button style={S.btn} onClick={() => bulkAction("advance")}>Bulk Advance</button>
                  <button style={S.btnDanger} onClick={() => bulkAction("cancel")}>Bulk Cancel</button>
                </>)}
                <button style={S.btn} onClick={loadBookings}>Refresh</button>
              </div>
            </div>
            {bookings.length === 0 ? (
              <div style={{ textAlign:"center", padding:"48px 20px", color:"rgba(230,236,244,0.3)", fontSize:13 }}>No bookings yet. They appear here and as live notifications.</div>
            ) : (
              <div style={{ overflowX:"auto" }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}><input type="checkbox" checked={selectedIds.size === bookings.length && bookings.length > 0} onChange={toggleAll} /></th>
                      {["Celebrity","Client","Event","Date","Quote","Status","Stage Jump","Actions"].map((h) => <th key={h} style={S.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} style={{ background: selectedIds.has(b.id) ? "rgba(148,180,216,0.05)" : "transparent" }}>
                        <td style={S.td}><input type="checkbox" checked={selectedIds.has(b.id)} onChange={() => toggleSelect(b.id)} /></td>
                        <td style={S.td}><span style={{ fontWeight:600, color:"#E6ECF4" }}>{b.celebrityName}</span></td>
                        <td style={S.td}><span style={{ color:"rgba(230,236,244,0.65)", fontSize:11 }}>{b.userEmail}</span></td>
                        <td style={S.td}>{b.eventType}</td>
                        <td style={S.td}>{b.date}</td>
                        <td style={{ ...S.td, color:"#94B4D8", fontWeight:700 }}>{fmtMoney(b.pricing?.finalQuote || 0)}</td>
                        <td style={S.td}><span style={S.pill(stageColor(b.status))}>{b.status}</span></td>
                        <td style={S.td}>
                          <select style={S.select} value={b.status} onChange={(e) => advanceBooking(b.id, e.target.value)}>
                            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={S.td}><button style={S.btnDanger} onClick={() => cancelBooking(b.id)}>Cancel</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div style={S.section}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(148,180,216,0.7)" }}>All Users - {users.length} registered</div>
              <button style={S.btn} onClick={loadUsers}>Refresh</button>
            </div>
            <table style={S.table}>
              <thead><tr>{["Name","Email","Role","Membership","Status","Actions"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={S.td}><span style={{ fontWeight:600 }}>{u.name}</span></td>
                    <td style={S.td}><span style={{ color:"rgba(230,236,244,0.65)" }}>{u.email}</span></td>
                    <td style={S.td}><span style={S.pill(u.role==="admin"?"#ef4444":u.role==="manager"?"#fbbf24":"#94B4D8")}>{u.role}</span></td>
                    <td style={S.td}><span style={{ fontSize:11, color:"rgba(230,236,244,0.55)" }}>{u.membershipTier}</span></td>
                    <td style={S.td}><span style={S.pill(u.suspended?"#ef4444":"#4ade80")}>{u.suspended?"Suspended":"Active"}</span></td>
                    <td style={S.td}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                        {u.role !== "admin" && (<>
                          <button style={u.suspended ? S.btn : S.btnDanger} onClick={() => suspendUser(u.id, !u.suspended)}>
                            {u.suspended ? "Restore" : "Suspend"}
                          </button>
                          <button style={S.btnGhost} onClick={() => impersonate(u.id)} title="Open main site logged in as this user">
                            Impersonate
                          </button>
                        </>)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CELEBRITIES */}
        {tab === "celebrities" && (
          <div style={S.section}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
              <div style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(148,180,216,0.7)" }}>Celebrity Roster - {celebTotal} total. Click price or demand to edit inline.</div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <button style={S.btn} disabled={celebPage <= 1} onClick={() => loadCelebs(celebPage - 1)}>Prev</button>
                <span style={{ fontSize:11, color:"rgba(230,236,244,0.4)", padding:"5px 10px" }}>Page {celebPage} / {Math.ceil(celebTotal / 20) || 1}</span>
                <button style={S.btn} disabled={celebPage * 20 >= celebTotal} onClick={() => loadCelebs(celebPage + 1)}>Next</button>
              </div>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={S.table}>
                <thead><tr>{["Name","Category","Region","Price","Demand","Avail Window","Availability","Actions"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {celebs.map((c) => (
                    <tr key={c.id}>
                      <td style={S.td}><span style={{ fontWeight:600, color:"#E6ECF4" }}>{c.name}</span></td>
                      <td style={S.td}><span style={{ fontSize:11, color:"rgba(230,236,244,0.6)" }}>{c.category}</span></td>
                      <td style={S.td}><span style={{ fontSize:11, color:"rgba(230,236,244,0.5)" }}>{c.region}</span></td>
                      <td style={S.td}>
                        {editingCeleb?.id === c.id && editingCeleb.field === "startingPrice" ? (
                          <input autoFocus style={{ ...S.input, width:90 }} defaultValue={c.startingPrice}
                            onBlur={(e) => saveCelebEdit(c.id, "startingPrice", Number(e.target.value))}
                            onKeyDown={(e) => { if (e.key==="Enter") saveCelebEdit(c.id,"startingPrice",Number(e.target.value)); if (e.key==="Escape") setEditingCeleb(null); }} />
                        ) : (
                          <span style={{ cursor:"pointer", color:"#94B4D8", fontWeight:700 }} onClick={() => setEditingCeleb({ id:c.id, field:"startingPrice" })}>
                            {fmtMoney(c.startingPrice)}
                          </span>
                        )}
                      </td>
                      <td style={S.td}>
                        {editingCeleb?.id === c.id && editingCeleb.field === "demandIndex" ? (
                          <input autoFocus style={{ ...S.input, width:60 }} defaultValue={c.demandIndex}
                            onBlur={(e) => saveCelebEdit(c.id, "demandIndex", Number(e.target.value))}
                            onKeyDown={(e) => { if (e.key==="Enter") saveCelebEdit(c.id,"demandIndex",Number(e.target.value)); if (e.key==="Escape") setEditingCeleb(null); }} />
                        ) : (
                          <span style={{ cursor:"pointer", color:"rgba(230,236,244,0.7)" }} onClick={() => setEditingCeleb({ id:c.id, field:"demandIndex" })}>
                            {c.demandIndex}
                          </span>
                        )}
                      </td>
                      <td style={S.td}><span style={{ fontSize:11, color:"rgba(230,236,244,0.5)" }}>{c.availabilityWindowDays}d</span></td>
                      <td style={S.td}><span style={S.pill(availColor(c.availability))}>{c.availability}</span></td>
                      <td style={S.td}><button style={S.btn} onClick={() => flipAvailability(c.id)}>Cycle Availability</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BROADCAST */}
        {tab === "broadcast" && (
          <div style={S.section}>
            <div style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(148,180,216,0.7)", marginBottom:20 }}>System Broadcast - Send Message to All User Inboxes</div>
            <div style={{ maxWidth:600 }}>
              <textarea
                style={{ ...S.input, width:"100%", minHeight:120, resize:"vertical", fontFamily:"inherit", fontSize:13, lineHeight:1.6, boxSizing:"border-box", display:"block" }}
                placeholder="Type your broadcast message to all users..."
                value={broadcastMsg}
                onChange={(e) => { setBroadcastMsg(e.target.value); setBroadcastResult(null); }}
              />
              <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:14 }}>
                <button style={{ ...S.btn, padding:"10px 24px", fontSize:12 }} onClick={sendBroadcast} disabled={!broadcastMsg.trim()}>
                  Send to All Users
                </button>
                {broadcastResult && <span style={{ fontSize:12, color:"#4ade80" }}>Delivered to {broadcastResult.recipients} users</span>}
              </div>
              <p style={{ marginTop:16, fontSize:11, color:"rgba(230,236,244,0.35)", lineHeight:1.5 }}>
                Messages are injected directly into every user&apos;s inbox and appear in the Client Portal. All broadcasts are logged in the audit trail.
              </p>
            </div>
            <div style={{ marginTop:32, borderTop:"1px solid rgba(148,180,216,0.08)", paddingTop:24 }}>
              <div style={{ fontSize:11, letterSpacing:"0.16em", textTransform:"uppercase", color:"rgba(148,180,216,0.5)", marginBottom:14 }}>Recent Broadcasts</div>
              {audit.filter((e) => e.action === "BROADCAST_SENT").slice(0, 5).length === 0 ? (
                <div style={{ fontSize:12, color:"rgba(230,236,244,0.25)" }}>No broadcasts sent yet.</div>
              ) : audit.filter((e) => e.action === "BROADCAST_SENT").slice(0, 5).map((e) => (
                <div key={e.id} style={{ padding:"10px 0", borderBottom:"1px solid rgba(148,180,216,0.06)", fontSize:12, display:"flex", gap:16, alignItems:"center" }}>
                  <span style={{ fontFamily:"monospace", fontSize:10, color:"rgba(230,236,244,0.3)" }}>{fmtD(e.timestamp)}</span>
                  <span style={{ color:"rgba(230,236,244,0.6)" }}>by {e.actor}</span>
                  <span style={S.pill("#fbbf24")}>ALL USERS</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIT LOG */}
        {tab === "audit" && (
          <div style={S.section}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(148,180,216,0.7)" }}>Audit Log - {audit.length} entries</div>
              <button style={S.btn} onClick={loadAudit}>Refresh</button>
            </div>
            <table style={S.table}>
              <thead><tr>{["Time","Actor","Action","Reference"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>
                {audit.map((entry) => (
                  <tr key={entry.id}>
                    <td style={S.td}><span style={{ fontSize:10, color:"rgba(230,236,244,0.4)", fontFamily:"monospace" }}>{fmtD(entry.timestamp)}</span></td>
                    <td style={S.td}><span style={{ fontSize:11, color:"rgba(230,236,244,0.7)" }}>{entry.actor}</span></td>
                    <td style={S.td}><span style={S.pill("#94B4D8")}>{entry.action}</span></td>
                    <td style={S.td}><span style={{ fontSize:10, color:"rgba(230,236,244,0.35)", fontFamily:"monospace", wordBreak:"break-all" }}>{entry.referenceId}</span></td>
                  </tr>
                ))}
                {audit.length === 0 && <tr><td colSpan={4} style={{ ...S.td, textAlign:"center", color:"rgba(230,236,244,0.25)", padding:40 }}>No audit entries yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LIVE NOTIFICATION PANEL */}
      {showNotif && (
        <div style={S.notifPanel}>
          <div style={S.notifHeader}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:"#94B4D8" }}>Live Event Feed</div>
              <div style={{ fontSize:10, color:"rgba(230,236,244,0.4)", marginTop:2 }}>{notifications.length} events this session</div>
            </div>
            <button style={{ background:"none", border:"none", color:"rgba(230,236,244,0.5)", cursor:"pointer", fontSize:18 }} onClick={() => setShowNotif(false)}>X</button>
          </div>
          <div style={{ overflowY:"auto", flex:1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding:"40px 20px", textAlign:"center", color:"rgba(230,236,244,0.25)", fontSize:12 }}>
                Listening for events...<br /><span style={{ fontSize:10 }}>New bookings appear here instantly</span>
              </div>
            ) : notifications.map((n, i) => {
              const { label, color } = notifLabel(n.type);
              return (
                <div key={i} style={{ padding:"14px 18px", borderBottom:"1px solid rgba(148,180,216,0.07)", fontSize:12 }}>
                  <div style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:700, color, marginBottom:4 }}>{label}</div>
                  <div style={{ color:"#E6ECF4", marginBottom:4 }}>
                    {n.type === "NEW_BOOKING"                    && `${n.payload?.celebrity} - ${n.payload?.client}`}
                    {n.type === "BOOKING_CANCELLED"              && `${n.payload?.celebrity} booking cancelled`}
                    {n.type === "BOOKING_STATUS_UPDATED"         && `Stage: ${n.payload?.stage}`}
                    {n.type === "USER_SUSPENDED"                 && `User ${n.payload?.userId} suspended`}
                    {n.type === "USER_UNSUSPENDED"               && `User ${n.payload?.userId} restored`}
                    {n.type === "BROADCAST"                      && `"${n.payload?.message?.slice(0,60)}..."`}
                    {n.type === "USER_IMPERSONATED"              && `Impersonating ${n.payload?.targetEmail}`}
                    {n.type === "BULK_ACTION"                    && `Bulk ${n.payload?.action} - ${n.payload?.affected} bookings`}
                    {n.type === "CELEBRITY_AVAILABILITY_CHANGED" && `${n.payload?.name} -> ${n.payload?.availability}`}
                  </div>
                  {n.type === "NEW_BOOKING" && (
                    <div style={{ fontSize:10, color:"rgba(230,236,244,0.4)" }}>{n.payload?.eventType} - {n.payload?.date} - {fmtMoney(n.payload?.quote || 0)}</div>
                  )}
                  <div style={{ fontSize:9, color:"rgba(230,236,244,0.25)", marginTop:5, fontFamily:"monospace" }}>{fmtD(n.at)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
