import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import "./Auth.css";

export default function Login({ setPage }) {
  const { login, error, setError } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) setPage("home");
      setLoading(false);
    }, 600);
  }

  return (
    <div className="auth-page page-enter">
      <div className="bg-decor">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-grid" />
      </div>

      <div className="auth-inner">
        <div className="auth-card">
          <div className="auth-logo">✈</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to manage your flight refunds</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@email.com"
                required
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="spin" /> : "Sign In"}
            </button>
          </form>

          <p className="auth-switch">
            No account?{" "}
            <button onClick={() => { setError(""); setPage("signup"); }}>Create one</button>
          </p>
        </div>
      </div>
    </div>
  );
}
