"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../components/NavBar";
import { fetchJson, logRevision } from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@aurelux.com");
  const [password, setPassword] = useState("Admin@123");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const submit = async (event) => {
    event.preventDefault();
    try {
      const result = await fetchJson("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("aurelux_token", result.token);
      localStorage.setItem("aurelux_user", JSON.stringify(result.user));
      logRevision("LOGIN_SUCCESS", `Authenticated as ${result.user.role} (${result.user.email})`);
      setStatus(`Authenticated as ${result.user.role}. Redirecting…`);
      const dest = result.user.role === "admin" ? "/admin" : result.user.role === "manager" ? "/portal" : "/";
      setTimeout(() => router.push(dest), 600);
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <main>
      <NavBar />
      <section className="glass mx-auto max-w-xl rounded-2xl p-6">
        <h2 className="text-2xl font-semibold">Sovereign Access Gateway</h2>
        <p className="mt-1 text-sm text-platinum/70">Use seeded credentials to unlock role-based portals.</p>
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <input className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full rounded-lg bg-sovereign px-4 py-3 font-semibold uppercase text-black">Authenticate</button>
        </form>
        <p className="mt-3 text-sm text-sovereign">{status}</p>
        <p className="mt-2 text-xs text-platinum/60">client@aurelux.com / Client@123 · manager@aurelux.com / Manager@123 · admin@aurelux.com / Admin@123</p>
      </section>
    </main>
  );
}
