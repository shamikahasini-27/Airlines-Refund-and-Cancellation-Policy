import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

export default function Navbar({ setPage }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__brand" onClick={() => setPage(user ? "home" : "login")}>
        <span className="navbar__plane">✈</span>
        AirRefund<span className="navbar__dot">.</span>
      </div>

      {user && (
        <div className="navbar__right">
          <button className="navbar__avatar" onClick={() => setOpen((o) => !o)}>
            {user.avatar}
          </button>

          {open && (
            <div className="navbar__dropdown">
              <p className="dd-name">{user.name}</p>
              <p className="dd-email">{user.email}</p>
              <hr className="dd-sep" />
              <button onClick={() => { setPage("home"); setOpen(false); }}>
                My Bookings
              </button>
              <button
                className="dd-logout"
                onClick={() => { logout(); setPage("login"); setOpen(false); }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
