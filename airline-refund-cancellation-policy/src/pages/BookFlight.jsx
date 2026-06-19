import React, { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { AVAILABLE_FLIGHTS } from "../data/mockData";
import { fmtINR } from "../utils/refundCalc";
import "./BookFlight.css";

const CITIES = [
  "Hyderabad (HYD)", "Mumbai (BOM)", "Delhi (DEL)",
  "Bangalore (BLR)", "Chennai (MAA)", "Kolkata (CCU)",
  "Goa (GOI)", "Pune (PNQ)", "Ahmedabad (AMD)", "Jaipur (JAI)",
];

const CLASSES = ["Economy", "Business"];

const AIRLINE_EMOJI = {
  "Air India": "🔴", "IndiGo": "🔵",
  "Vistara": "🟣",   "SpiceJet": "🟠",
  "GoFirst": "🟡",   "AirAsia": "🟢",
};

export default function BookFlight({ setPage, onBookingConfirmed }) {
  const { user } = useAuth();

  const [step, setStep]     = useState("search"); // search | results | confirm | done
  const [from, setFrom]     = useState("");
  const [to, setTo]         = useState("");
  const [date, setDate]     = useState("");
  const [seatClass, setSeatClass] = useState("Economy");
  const [results, setResults]     = useState([]);
  const [selected, setSelected]   = useState(null);
  const [searchErr, setSearchErr] = useState("");
  const [loading, setLoading]     = useState(false);
  const [bookedTicket, setBookedTicket] = useState(null);

  // min date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 30); // at least 30 days out
  const minDate = tomorrow.toISOString().split("T")[0];

  function handleSearch(e) {
    e.preventDefault();
    if (from === to) { setSearchErr("Origin and destination cannot be the same."); return; }
    setSearchErr("");
    setLoading(true);

    setTimeout(() => {
      // Filter available flights or generate synthetic ones
      const fromCode = from.match(/\((\w+)\)/)?.[1] || "HYD";
      const toCode   = to.match(/\((\w+)\)/)?.[1]   || "BOM";

      let found = AVAILABLE_FLIGHTS.filter(
        (f) => f.fromCode === fromCode && f.toCode === toCode
      );

      // If no exact match, generate 3 synthetic options
      if (found.length === 0) {
        found = generateFlights(from, to, fromCode, toCode, date, seatClass);
      } else {
        found = found.map((f) => ({ ...f, travelDate: date, seatClass }));
      }

      setResults(found);
      setStep("results");
      setLoading(false);
    }, 800);
  }

  function handleSelect(flight) {
    setSelected(flight);
    setStep("confirm");
  }

  function handleConfirmBooking() {
    setLoading(true);
    setTimeout(() => {
      const today = new Date().toISOString().split("T")[0];
      const newBooking = {
        id: `BK-${Date.now()}`,
        userId: user.id,
        flightNo:    selected.flightNo,
        airline:     selected.airline,
        from:        selected.from,
        to:          selected.to,
        fromCode:    selected.fromCode,
        toCode:      selected.toCode,
        bookingDate: today,
        flightDate:  selected.travelDate,
        seatClass:   selected.seatClass,
        seat:        generateSeat(selected.seatClass),
        fare:        selected.fare,
        routeFreq:   selected.routeFreq,
        availFlights: selected.availFlights,
      };
      setBookedTicket(newBooking);
      onBookingConfirmed(newBooking);
      setStep("done");
      setLoading(false);
    }, 900);
  }

  /* ─── STEP: Search Form ──────────────────────────────────────────────── */
  if (step === "search") return (
    <div className="bf-page page-enter">
      <div className="bg-decor">
        <div className="bg-orb bg-orb-1" /><div className="bg-orb bg-orb-2" /><div className="bg-grid" />
      </div>
      <div className="bf-inner">
        <button className="back-btn" onClick={() => setPage("home")}>← Back to Dashboard</button>

        <div className="bf-hero">
          <h1 className="bf-title">Book a Flight</h1>
          <p className="bf-sub">Search available flights, book your ticket, then access your refund tracker.</p>
        </div>

        <div className="bf-search-card">
          <div className="bf-search-card__header">
            <span className="bf-search-icon">🔍</span>
            <span>Search Flights</span>
          </div>

          {searchErr && <div className="auth-error">{searchErr}</div>}

          <form onSubmit={handleSearch} className="bf-form">
            <div className="bf-form-row">
              <div className="bf-field">
                <label>From</label>
                <select value={from} onChange={(e) => setFrom(e.target.value)} required>
                  <option value="">Select origin</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="bf-swap">⇄</div>
              <div className="bf-field">
                <label>To</label>
                <select value={to} onChange={(e) => setTo(e.target.value)} required>
                  <option value="">Select destination</option>
                  {CITIES.filter((c) => c !== from).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="bf-form-row">
              <div className="bf-field">
                <label>Travel Date</label>
                <input
                  type="date"
                  value={date}
                  min={minDate}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="bf-field">
                <label>Class</label>
                <select value={seatClass} onChange={(e) => setSeatClass(e.target.value)}>
                  {CLASSES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="spin" /> : "Search Flights ✈"}
            </button>
          </form>
        </div>

        {/* info strip */}
        <div className="bf-info-strip">
          <div className="bf-info-item">
            <span className="bf-info-icon">📋</span>
            <span>After booking, the <strong>Refund Tracker</strong> is unlocked for your ticket</span>
          </div>
          <div className="bf-info-item">
            <span className="bf-info-icon">💰</span>
            <span>Drag the timeline to preview your refund before cancelling</span>
          </div>
          <div className="bf-info-item">
            <span className="bf-info-icon">⚡</span>
            <span>Cancellation policy adjusts live based on route demand &amp; time left</span>
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── STEP: Search Results ───────────────────────────────────────────── */
  if (step === "results") return (
    <div className="bf-page page-enter">
      <div className="bg-decor">
        <div className="bg-orb bg-orb-1" /><div className="bg-orb bg-orb-2" /><div className="bg-grid" />
      </div>
      <div className="bf-inner">
        <button className="back-btn" onClick={() => setStep("search")}>← Modify Search</button>

        <div className="bf-results-header">
          <h2 className="bf-results-title">
            {from.split("(")[0].trim()} → {to.split("(")[0].trim()}
          </h2>
          <p className="bf-results-sub">
            {results.length} flights found · {new Date(date).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })} · {seatClass}
          </p>
        </div>

        <div className="bf-flight-list">
          {results.map((f, i) => (
            <div key={i} className="bf-flight-card">
              <div className="bf-fc-left">
                <div className="bf-fc-airline">
                  {AIRLINE_EMOJI[f.airline] ?? "✈"} <strong>{f.airline}</strong>
                  <span className="bf-fc-no">{f.flightNo}</span>
                </div>
                <div className="bf-fc-times">
                  <span className="bf-fc-time">{f.depTime}</span>
                  <div className="bf-fc-dur-line">
                    <span className="bf-fc-dur">{f.duration}</span>
                    <div className="bf-fc-line"><div className="bf-fc-dot" /></div>
                  </div>
                  <span className="bf-fc-time">{f.arrTime}</span>
                </div>
                <div className="bf-fc-route">
                  <span>{f.fromCode}</span>
                  <span>{f.toCode}</span>
                </div>
              </div>
              <div className="bf-fc-right">
                <div className="bf-fc-fare">{fmtINR(f.fare)}</div>
                <div className="bf-fc-class">{seatClass}</div>
                <div className="bf-fc-seats">{f.seatsLeft} seats left</div>
                <button className="bf-select-btn" onClick={() => handleSelect({ ...f, travelDate: date, seatClass })}>
                  Select →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── STEP: Confirm Booking ──────────────────────────────────────────── */
  if (step === "confirm") return (
    <div className="bf-page page-enter">
      <div className="bg-decor">
        <div className="bg-orb bg-orb-1" /><div className="bg-orb bg-orb-2" /><div className="bg-grid" />
      </div>
      <div className="bf-inner">
        <button className="back-btn" onClick={() => setStep("results")}>← Back to Results</button>

        <div className="bf-confirm-card">
          <div className="bf-confirm-header">
            <span className="bf-confirm-icon">🎫</span>
            <h2>Confirm Your Booking</h2>
            <p>Review details before confirming. Once booked, the Refund Tracker will be activated.</p>
          </div>

          <div className="bf-confirm-ticket">
            <div className="bf-ct-airline">
              {AIRLINE_EMOJI[selected.airline] ?? "✈"} {selected.airline} · {selected.flightNo}
            </div>
            <div className="bf-ct-route">
              <div className="bf-ct-endpoint">
                <div className="bf-ct-code">{selected.fromCode}</div>
                <div className="bf-ct-city">{selected.from}</div>
                <div className="bf-ct-time">{selected.depTime}</div>
              </div>
              <div className="bf-ct-mid">
                <span className="bf-ct-dur">{selected.duration}</span>
                <div className="bf-ct-line">✈</div>
              </div>
              <div className="bf-ct-endpoint" style={{ textAlign: "right" }}>
                <div className="bf-ct-code">{selected.toCode}</div>
                <div className="bf-ct-city">{selected.to}</div>
                <div className="bf-ct-time">{selected.arrTime}</div>
              </div>
            </div>

            <div className="bf-ct-meta">
              <div className="bf-ct-item"><span className="bf-ct-lbl">Date</span><span>{new Date(selected.travelDate).toLocaleDateString("en-IN", {day:"2-digit",month:"short",year:"numeric"})}</span></div>
              <div className="bf-ct-item"><span className="bf-ct-lbl">Class</span><span>{selected.seatClass}</span></div>
              <div className="bf-ct-item"><span className="bf-ct-lbl">Passenger</span><span>{user?.name}</span></div>
              <div className="bf-ct-item"><span className="bf-ct-lbl">Fare</span><span className="bf-ct-fare">{fmtINR(selected.fare)}</span></div>
            </div>
          </div>

          <div className="bf-confirm-note">
            <span>📋</span>
            After booking, a <strong>Refund Tracker</strong> will be activated on this ticket — drag the timeline to preview your cancellation refund at any time.
          </div>

          <button className="auth-submit" onClick={handleConfirmBooking} disabled={loading}>
            {loading ? <span className="spin" /> : `Confirm & Pay ${fmtINR(selected.fare)}`}
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── STEP: Booking Done ─────────────────────────────────────────────── */
  if (step === "done") return (
    <div className="bf-page page-enter">
      <div className="bg-decor">
        <div className="bg-orb bg-orb-1" /><div className="bg-orb bg-orb-2" /><div className="bg-grid" />
      </div>
      <div className="bf-inner">
        <div className="bf-done-card">
          <div className="bf-done-icon">✅</div>
          <h2 className="bf-done-title">Booking Confirmed!</h2>
          <p className="bf-done-sub">Your ticket has been booked successfully.</p>

          <div className="bf-done-ref">
            Booking ID: <strong>{bookedTicket?.id}</strong>
          </div>

          <div className="bf-done-actions">
            <button className="bf-done-primary" onClick={() => setPage("refund")}>
              🔍 Open Refund Tracker
            </button>
            <button className="bf-done-secondary" onClick={() => setPage("home")}>
              View All Bookings
            </button>
          </div>

          <div className="bf-done-note">
            The Refund Tracker is now active for this booking. You can drag the timeline to see your estimated refund for any cancellation date.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function generateSeat(cls) {
  const rows    = cls === "Business" ? [1,2,3,4] : [10,11,12,13,14,15,16,17,18,19,20];
  const letters = cls === "Business" ? ["A","B","C","D"] : ["A","B","C","D","E","F"];
  return `${rows[Math.floor(Math.random()*rows.length)]}${letters[Math.floor(Math.random()*letters.length)]}`;
}

function generateFlights(from, to, fromCode, toCode, date, seatClass) {
  const airlines = [
    { name: "IndiGo",    code: "6E", base: 3800 },
    { name: "Air India", code: "AI", base: 4500 },
    { name: "SpiceJet",  code: "SG", base: 3200 },
    { name: "Vistara",   code: "UK", base: 5000 },
  ];
  const times = [
    { dep: "05:30", arr: "07:45", dur: "2h 15m" },
    { dep: "09:10", arr: "11:20", dur: "2h 10m" },
    { dep: "13:45", arr: "16:00", dur: "2h 15m" },
    { dep: "18:30", arr: "20:40", dur: "2h 10m" },
  ];
  const fromCity = from.split("(")[0].trim();
  const toCity   = to.split("(")[0].trim();

  return airlines.map((a, i) => {
    const mult = seatClass === "Business" ? 2.8 : 1;
    const fare = Math.round((a.base + Math.random() * 1200) * mult / 100) * 100;
    const t    = times[i % times.length];
    return {
      flightNo:     `${a.code}-${100 + Math.floor(Math.random()*900)}`,
      airline:      a.name,
      from:         fromCity,
      to:           toCity,
      fromCode,
      toCode,
      depTime:      t.dep,
      arrTime:      t.arr,
      duration:     t.dur,
      fare,
      seatsLeft:    Math.floor(Math.random() * 20) + 2,
      routeFreq:    ["high","medium","low"][Math.floor(Math.random()*3)],
      availFlights: Math.floor(Math.random() * 12) + 2,
    };
  });
}
