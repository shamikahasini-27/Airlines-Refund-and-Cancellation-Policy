import React from "react";
import { useAuth } from "../components/AuthContext";
import { BOOKINGS } from "../data/mockData";
import { daysDiff, fmtDate, fmtINR } from "../utils/refundCalc";
import "./Home.css";

const AIRLINE_EMOJI = {
  "Air India": "🔴",
  "IndiGo":    "🔵",
  "Vistara":   "🟣",
  "SpiceJet":  "🟠",
};

export default function Home({ setPage, setSelectedBooking, extraBookings = [] }) {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  // Combine seeded bookings + any newly created ones for this session
  const allBookings   = [...BOOKINGS, ...extraBookings];
  const myBookings    = allBookings.filter((b) => b.userId === user?.id);
  const totalFare     = myBookings.reduce((s, b) => s + b.fare, 0);
  const highRefund    = myBookings.filter((b) => daysDiff(today, b.flightDate) > 30).length;

  function openRefund(booking) {
    setSelectedBooking(booking);
    setPage("refund");
  }

  return (
    <div className="home-page page-enter">
      <div className="bg-decor">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-grid" />
      </div>

      <div className="home-content">
        {/* Hero */}
        <div className="home-hero">
          <p className="hero-greet">Good day, {user?.name?.split(" ")[0]} 👋</p>
          <h1 className="hero-title">
            Your Flight<br />
            <span className="hero-accent">Refund Tracker</span>
          </h1>
          <p className="hero-sub">
            Book a flight to unlock the refund timeline. Drag to preview your
            cancellation payout before you decide.
          </p>
          {/* Book a flight CTA */}
          <button className="book-flight-btn" onClick={() => setPage("book")}>
            ✈ Book a New Flight
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-val">{myBookings.length}</div>
            <div className="stat-lbl">Active Bookings</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{fmtINR(totalFare)}</div>
            <div className="stat-lbl">Total Fare Paid</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{highRefund}</div>
            <div className="stat-lbl">High Refund Eligible</div>
          </div>
        </div>

        {/* Bookings section */}
        <div className="bookings-header">
          <h2 className="section-title">Your Bookings</h2>
          <button className="book-mini-btn" onClick={() => setPage("book")}>+ New Booking</button>
        </div>

        {myBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings__icon">🎫</div>
            <p className="no-bookings__main">No bookings yet</p>
            <p className="no-bookings__sub">
              Book a flight first — the Refund Tracker activates automatically after booking.
            </p>
            <button className="book-flight-btn" style={{ marginTop: "1.25rem" }} onClick={() => setPage("book")}>
              ✈ Book Your First Flight
            </button>
          </div>
        ) : (
          <div className="book-grid">
            {myBookings.map((b) => {
              const dl  = daysDiff(today, b.flightDate);
              const cls = dl > 30 ? "g" : dl > 7 ? "y" : "r";
              return (
                <div key={b.id} className="bcard" onClick={() => openRefund(b)}>
                  <div className="bcard-head">
                    <span className="bcard-airline">
                      {AIRLINE_EMOJI[b.airline] ?? "✈"} {b.airline}
                    </span>
                    <span className={`badge badge-${cls}`}>{dl}d left</span>
                  </div>
                  <div className="route-row">
                    <span className="route-code">{b.fromCode}</span>
                    <span className="route-arrow">──✈──</span>
                    <span className="route-code">{b.toCode}</span>
                  </div>
                  <div className="route-cities">
                    <span>{b.from}</span>
                    <span>{b.to}</span>
                  </div>
                  <div className="bcard-info">
                    <div className="info-row"><span className="info-lbl">Flight</span><span>{b.flightNo}</span></div>
                    <div className="info-row"><span className="info-lbl">Date</span><span>{fmtDate(b.flightDate)}</span></div>
                    <div className="info-row"><span className="info-lbl">Class</span><span>{b.seatClass} · {b.seat}</span></div>
                    <div className="info-row"><span className="info-lbl">Fare</span><span className="fare-val">{fmtINR(b.fare)}</span></div>
                  </div>
                  <div className="bcard-cta">Open Refund Tracker →</div>
                </div>
              );
            })}

            {/* Add more card */}
            <div className="bcard bcard--add" onClick={() => setPage("book")}>
              <div className="bcard-add-icon">+</div>
              <div className="bcard-add-text">Book Another Flight</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
