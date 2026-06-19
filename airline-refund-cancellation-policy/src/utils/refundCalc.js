import { POLICY_TIERS } from "../data/mockData";

/** Days between two ISO date strings (always positive) */
export const daysDiff = (from, to) =>
  Math.max(0, Math.floor((new Date(to) - new Date(from)) / 86_400_000));

/** Format ISO date → "12 Jun 2025" */
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/** Format number → ₹7,800 */
export const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/** Given a slider percentage (0–100) and booking window, return the cancel date */
export const sliderToDate = (bookingDate, flightDate, pct) => {
  const total = daysDiff(bookingDate, flightDate);
  const elapsed = Math.round((total * pct) / 100);
  const d = new Date(bookingDate);
  d.setDate(d.getDate() + elapsed);
  return d.toISOString().split("T")[0];
};

/** Where "today" sits on the booking→flight timeline (0–99) */
export const todayPct = (bookingDate, flightDate) => {
  const total = daysDiff(bookingDate, flightDate);
  if (total === 0) return 0;
  const elapsed = daysDiff(bookingDate, new Date().toISOString().split("T")[0]);
  return Math.min(99, Math.max(0, Math.round((elapsed / total) * 100)));
};

/**
 * Core refund calculation.
 * Returns: { daysLeft, tier, pct, gross, net, conv, cls, conds, zone }
 */
export const calcRefund = (booking, cancelDate) => {
  const daysLeft = daysDiff(cancelDate, booking.flightDate);
  const tier =
    POLICY_TIERS.find((t) => daysLeft >= t.min && daysLeft <= t.max) ||
    POLICY_TIERS[POLICY_TIERS.length - 1];

  let pct = tier.pct;
  if (booking.routeFreq === "high") pct = Math.max(pct - 8, 0);
  if (booking.routeFreq === "low")  pct = Math.min(pct + 4, 95);
  if (booking.availFlights <= 3)    pct = Math.max(pct - 5, 0);

  const conv = 350;
  const cls  = booking.seatClass === "Business" ? 2000 : 0;
  const gross = Math.round((booking.fare * pct) / 100);
  const net   = Math.max(0, gross - conv - cls);

  const conds = [];
  if (booking.routeFreq === "high")   conds.push("High-demand route — 8% demand adjustment applied");
  if (booking.routeFreq === "low")    conds.push("Low-demand route — +4% favourable adjustment applied");
  if (booking.availFlights <= 3)      conds.push("Very few alternate flights on route — 5% reduction applied");
  if (booking.seatClass === "Business") conds.push("Business class: flat ₹2,000 cancellation fee deducted");
  if (daysLeft <= 2)                  conds.push("Within 48 hrs of departure — minimal refund only");

  const zone =
    pct >= 70 ? "green" : pct >= 40 ? "yellow" : pct >= 20 ? "orange" : "red";

  return { daysLeft, tier, pct, gross, net, conv, cls, conds, zone };
};
