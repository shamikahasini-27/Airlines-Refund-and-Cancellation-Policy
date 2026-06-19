import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import "./Auth.css";

export default function Signup({ setPage }) {
  const { signup, error, setError } = useAuth();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }
    setLoading(true);
    setTimeout(() => {
      const ok = signup(name, email, password);
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
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Track your refunds before you cancel</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="Your full name"
                required
              />
            </div>
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
                placeholder="Create a password"
                required
              />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="spin" /> : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <button onClick={() => { setError(""); setPage("login"); }}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
