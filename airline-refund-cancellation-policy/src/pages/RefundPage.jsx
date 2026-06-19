import React, { useState, useRef, useEffect, useCallback } from "react";
import { POLICY_TIERS, RULES, CANCEL_STEPS } from "../data/mockData";
import { calcRefund, daysDiff, fmtDate, fmtINR, sliderToDate, todayPct } from "../utils/refundCalc";
import "./RefundPage.css";

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 1 — INTERACTIVE TIMELINE + REFUND CALCULATOR
   ═══════════════════════════════════════════════════════════════════════════ */
function RefundTab({ booking }) {
  const initPct  = todayPct(booking.bookingDate, booking.flightDate);
  const [pct, setPct] = useState(initPct);
  const trackRef  = useRef(null);
  const dragging  = useRef(false);
  const todayP    = todayPct(booking.bookingDate, booking.flightDate);

  const cancelDate = sliderToDate(booking.bookingDate, booking.flightDate, pct);
  const result     = calcRefund(booking, cancelDate);

  /* ── drag helpers ── */
  const calcPct = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    return Math.min(100, Math.max(0, Math.round(((clientX - rect.left) / rect.width) * 100)));
  }, []);

  const onMouseMove = useCallback((e) => { if (dragging.current) setPct(calcPct(e.clientX)); }, [calcPct]);
  const onMouseUp   = useCallback(() => { dragging.current = false; }, []);
  const onTouchMove = useCallback((e) => { if (dragging.current) setPct(calcPct(e.touches[0].clientX)); }, [calcPct]);
  const onTouchEnd  = useCallback(() => { dragging.current = false; }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend",  onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  /* ── colour helpers ── */
  const thumbColor = result.tier.color;
  const rrClass    = { green: "rr-green", yellow: "rr-yellow", orange: "rr-orange", red: "rr-red" }[result.zone];
  const pctClass   = { green: "pct-g", yellow: "pct-y", orange: "pct-o", red: "pct-r" }[result.zone];

  const zoneColors = ["#00c896","#7ecb6e","#f5c842","#f5a623","#e8533a","#c0392b"];

  return (
    <div className="panel">
      <h2 className="panel-title">Refund Timeline Estimator</h2>
      <p className="panel-sub">
        Drag the handle to any date between your booking and flight to see the estimated
        refund you would receive if you cancelled at that point. <span style={{ color: "#f5b942" }}>▲ Today</span> is marked in amber.
      </p>

      {/* ── TIMELINE ── */}
      <div className="tl-wrap">
        <div className="tl-date-labels">
          <span>Booked · {fmtDate(booking.bookingDate)}</span>
          <span>Flying · {fmtDate(booking.flightDate)}</span>
        </div>

        <div
          className="tl-track-area"
          ref={trackRef}
          onClick={(e) => setPct(calcPct(e.clientX))}
        >
          {/* zone colour bands */}
          <div className="tl-zones">
            {zoneColors.map((c, i) => (
              <div key={i} className="tl-zone" style={{ background: c, opacity: 0.22 }} />
            ))}
          </div>

          {/* filled progress */}
          <div
            className="tl-fill"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg,#00c896,${thumbColor})` }}
          />

          {/* today marker */}
          <div className="tl-today-line" style={{ left: `${todayP}%` }} />
          <div className="tl-today-label" style={{ left: `${todayP}%` }}>▲ Today</div>

          {/* draggable thumb */}
          <div
            className="tl-thumb"
            style={{ left: `${pct}%`, borderColor: thumbColor }}
            onMouseDown={(e) => { dragging.current = true; e.preventDefault(); }}
            onTouchStart={(e) => { dragging.current = true; e.stopPropagation(); }}
          />
        </div>

        <div className="tl-bottom-labels">
          <span>{fmtDate(booking.bookingDate)}</span>
          <span className="tl-cancel-date">
            If cancelled: <strong>{fmtDate(cancelDate)}</strong> · {result.daysLeft}d before flight
          </span>
          <span>{fmtDate(booking.flightDate)}</span>
        </div>
      </div>

      {/* ── RESULT CARD ── */}
      <div className={`refund-result ${rrClass}`}>
        <div className="rr-top">
          <div>
            <div className="rr-label" style={{ color: thumbColor }}>Estimated Refund</div>
            <div className="rr-amount" style={{ color: thumbColor }}>{fmtINR(result.net)}</div>
          </div>
          <div className={`rr-pct-badge ${pctClass}`}>{result.pct}%</div>
        </div>

        <div className="rr-breakdown">
          <div className="rr-item">
            <span className="rr-item-lbl">Fare Paid</span>
            <span className="rr-item-val">{fmtINR(booking.fare)}</span>
          </div>
          <div className="rr-item">
            <span className="rr-item-lbl">Base Refund ({result.pct}%)</span>
            <span className="rr-item-val">{fmtINR(result.gross)}</span>
          </div>
          <div className="rr-item">
            <span className="rr-item-lbl">Convenience Fee</span>
            <span className="rr-item-val rr-neg">–{fmtINR(result.conv)}</span>
          </div>
          {result.cls > 0 && (
            <div className="rr-item">
              <span className="rr-item-lbl">Business Class Fee</span>
              <span className="rr-item-val rr-neg">–{fmtINR(result.cls)}</span>
            </div>
          )}
          <div className="rr-item">
            <span className="rr-item-lbl">Policy Window</span>
            <span className="rr-item-val">{result.tier.label}</span>
          </div>
          <div className="rr-item">
            <span className="rr-item-lbl">Days Until Flight</span>
            <span className="rr-item-val">{result.daysLeft} days</span>
          </div>
        </div>
      </div>

      {/* ── CONDITIONS ── */}
      {result.conds.length > 0 && (
        <div className="conds-box">
          <div className="conds-title">Conditions Applied to This Estimate</div>
          {result.conds.map((c, i) => (
            <div key={i} className="cond-item">
              <span className="cond-dot" />
              {c}
            </div>
          ))}
        </div>
      )}

      <button className="cancel-cta">Proceed to Cancel This Booking</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 2 — POLICY & RULES
   ═══════════════════════════════════════════════════════════════════════════ */
function PolicyTab() {
  return (
    <div className="panel">
      <h2 className="panel-title">Rules & Policy Manual</h2>
      <p className="panel-sub">
        Official refund and cancellation policy. Please read carefully before initiating
        any cancellation request.
      </p>

      {/* tier table */}
      <div className="policy-section">
        <div className="ps-title">📋 Refund by Cancellation Window</div>
        <div className="tier-grid">
          {POLICY_TIERS.map((t, i) => (
            <div key={i} className="tier-row" style={{ borderColor: t.color + "33" }}>
              <div className="tier-dot" style={{ background: t.color }} />
              <div className="tier-label">{t.label}</div>
              <div className="tier-pct" style={{ color: t.color }}>{t.pct}% refund</div>
            </div>
          ))}
        </div>
      </div>

      {/* rules list */}
      <div className="policy-section">
        <div className="ps-title">⚖️ General Rules & Conditions</div>
        {RULES.map((r, i) => (
          <div key={i} className="rule-row">
            <div className="rule-num">{i + 1}</div>
            <div className="rule-text">{r}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TAB 3 — CANCELLATION STEPS
   ═══════════════════════════════════════════════════════════════════════════ */
function CancelTab({ booking }) {
  return (
    <div className="panel">
      <h2 className="panel-title">Cancellation Process</h2>
      <p className="panel-sub">
        Follow the steps below to cancel your booking. Cancellation is permanent and
        cannot be reversed once confirmed.
      </p>

      <div className="cancel-steps">
        {CANCEL_STEPS.map((s, i) => (
          <div key={i} className="cs">
            <div className="cs-num">{i + 1}</div>
            <div>
              <div className="cs-title">{s.title}</div>
              <div className="cs-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="warn-box">
        <div className="warn-box-title">⚠ Important Notice</div>
        <div className="warn-box-text">
          Cancellation is permanent and irreversible. Once confirmed, your seat will be
          released to other passengers. Ensure you have reviewed the refund estimate on
          the Refund tab before proceeding. Actual refund may vary slightly based on
          real-time availability at the time of cancellation.
        </div>
      </div>

      <button className="cancel-cta" style={{ marginTop: "1.25rem" }}>
        Initiate Cancellation — {booking.flightNo}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARENT — REFUND PAGE
   ═══════════════════════════════════════════════════════════════════════════ */
export default function RefundPage({ booking, setPage }) {
  const [tab, setTab] = useState("refund");
  const today  = new Date().toISOString().split("T")[0];
  const daysLeft = daysDiff(today, booking.flightDate);

  const TABS = [
    { id: "refund", icon: "💰", label: "Refund Estimator" },
    { id: "policy", icon: "📖", label: "Rules & Policy"   },
    { id: "cancel", icon: "🚫", label: "Cancellation"     },
  ];

  return (
    <div className="rfpage page-enter">
      {/* background */}
      <div className="bg-decor">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-grid" />
      </div>

      <div className="rfpage-inner">
        {/* back */}
        <button className="back-btn" onClick={() => setPage("home")}>
          ← Back to Bookings
        </button>

        {/* flight banner */}
        <div className="flight-banner">
          <div className="fb-top">
            <div>
              <div className="fb-airline">{booking.airline}</div>
              <div className="fb-flightno">{booking.flightNo} · {booking.seatClass} · Seat {booking.seat}</div>
            </div>
            <div className="fb-fare-block">
              <div className="fb-fare-lbl">Fare Paid</div>
              <div className="fb-fare-val">{fmtINR(booking.fare)}</div>
            </div>
          </div>

          <div className="fb-route-row">
            <span className="fb-code">{booking.fromCode}</span>
            <div className="fb-mid">
              <span className="fb-arrow">──── ✈ ────</span>
              <span className="fb-dur">{daysLeft} days until departure</span>
            </div>
            <span className="fb-code">{booking.toCode}</span>
          </div>
          <div className="fb-cities">
            <span>{booking.from}</span>
            <span>{booking.to}</span>
          </div>

          <div className="fb-meta">
            <div className="fb-meta-item">
              <span className="fb-meta-lbl">Booked</span>
              <span>{fmtDate(booking.bookingDate)}</span>
            </div>
            <div className="fb-meta-item">
              <span className="fb-meta-lbl">Flying</span>
              <span>{fmtDate(booking.flightDate)}</span>
            </div>
            <div className="fb-meta-item">
              <span className="fb-meta-lbl">Route demand</span>
              <span style={{ textTransform: "capitalize" }}>{booking.routeFreq}</span>
            </div>
            <div className="fb-meta-item">
              <span className="fb-meta-lbl">Daily alt. flights</span>
              <span>{booking.availFlights}</span>
            </div>
          </div>
        </div>

        {/* 3 tabs */}
        <div className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "refund" && <RefundTab booking={booking} />}
        {tab === "policy" && <PolicyTab />}
        {tab === "cancel" && <CancelTab booking={booking} />}
      </div>
    </div>
  );
}
