const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const fetchJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Request failed");
  }

  return response.json();
};

export const getAuthToken = () => (typeof window !== "undefined" ? localStorage.getItem("aurelux_token") : null);

export const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const REVISION_KEY = "aurelux_revision_log";

export const getRevisionLog = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(REVISION_KEY) || "[]");
  } catch {
    return [];
  }
};

export const logRevision = (action, detail) => {
  if (typeof window === "undefined") return;
  const existing = getRevisionLog();
  const entry = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    action,
    detail,
    at: new Date().toISOString(),
  };
  const next = [entry, ...existing].slice(0, 50);
  localStorage.setItem(REVISION_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("aurelux:revision-updated"));
};
