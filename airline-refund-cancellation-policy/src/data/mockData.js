// ─── HARDCODED USERS ──────────────────────────────────────────────────────────
export const USERS = [
  { id: 1, email: "arjun.sharma@email.com", password: "pass123", name: "Arjun Sharma", avatar: "AS" },
  { id: 2, email: "priya.reddy@email.com",  password: "pass123", name: "Priya Reddy",   avatar: "PR" },
  { id: 3, email: "demo@airrefund.com",      password: "demo",    name: "Demo User",     avatar: "DU" },
];

// ─── EXISTING HARDCODED BOOKINGS (seeded per user) ───────────────────────────
// NOTE: New bookings made via BookFlight page are added to this array at runtime
export const BOOKINGS = [
  {
    id: "BK-001", userId: 1,
    flightNo: "AI-204",  airline: "Air India",
    from: "Hyderabad",   to: "Mumbai",
    fromCode: "HYD",     toCode: "BOM",
    bookingDate: "2025-04-10", flightDate: "2025-08-28",
    seatClass: "Economy", seat: "14C", fare: 7800,
    routeFreq: "high",   availFlights: 12,
  },
  {
    id: "BK-002", userId: 1,
    flightNo: "6E-308",  airline: "IndiGo",
    from: "Hyderabad",   to: "Delhi",
    fromCode: "HYD",     toCode: "DEL",
    bookingDate: "2025-05-05", flightDate: "2025-09-15",
    seatClass: "Economy", seat: "22A", fare: 5400,
    routeFreq: "medium", availFlights: 8,
  },
  {
    id: "BK-003", userId: 2,
    flightNo: "UK-820",  airline: "Vistara",
    from: "Mumbai",      to: "Bangalore",
    fromCode: "BOM",     toCode: "BLR",
    bookingDate: "2025-04-20", flightDate: "2025-08-25",
    seatClass: "Business", seat: "3B", fare: 18500,
    routeFreq: "high",   availFlights: 15,
  },
  {
    id: "BK-004", userId: 3,
    flightNo: "SG-112",  airline: "SpiceJet",
    from: "Delhi",       to: "Goa",
    fromCode: "DEL",     toCode: "GOI",
    bookingDate: "2025-05-10", flightDate: "2025-10-04",
    seatClass: "Economy", seat: "18F", fare: 4200,
    routeFreq: "low",    availFlights: 3,
  },
];

// ─── PRE-DEFINED AVAILABLE FLIGHTS FOR SEARCH ────────────────────────────────
export const AVAILABLE_FLIGHTS = [
  // HYD → BOM
  { flightNo:"AI-202", airline:"Air India", from:"Hyderabad", to:"Mumbai", fromCode:"HYD", toCode:"BOM", depTime:"06:00", arrTime:"07:55", duration:"1h 55m", fare:6200, seatsLeft:14, routeFreq:"high",   availFlights:14 },
  { flightNo:"6E-310", airline:"IndiGo",    from:"Hyderabad", to:"Mumbai", fromCode:"HYD", toCode:"BOM", depTime:"10:15", arrTime:"12:00", duration:"1h 45m", fare:4900, seatsLeft:6,  routeFreq:"high",   availFlights:14 },
  { flightNo:"SG-204", airline:"SpiceJet",  from:"Hyderabad", to:"Mumbai", fromCode:"HYD", toCode:"BOM", depTime:"16:30", arrTime:"18:20", duration:"1h 50m", fare:4200, seatsLeft:20, routeFreq:"high",   availFlights:14 },
  { flightNo:"UK-880", airline:"Vistara",   from:"Hyderabad", to:"Mumbai", fromCode:"HYD", toCode:"BOM", depTime:"19:45", arrTime:"21:35", duration:"1h 50m", fare:8900, seatsLeft:4,  routeFreq:"high",   availFlights:14 },
  // HYD → DEL
  { flightNo:"6E-308", airline:"IndiGo",    from:"Hyderabad", to:"Delhi",  fromCode:"HYD", toCode:"DEL", depTime:"07:30", arrTime:"09:55", duration:"2h 25m", fare:5200, seatsLeft:18, routeFreq:"medium", availFlights:8  },
  { flightNo:"AI-406", airline:"Air India", from:"Hyderabad", to:"Delhi",  fromCode:"HYD", toCode:"DEL", depTime:"13:00", arrTime:"15:25", duration:"2h 25m", fare:6800, seatsLeft:9,  routeFreq:"medium", availFlights:8  },
  { flightNo:"UK-832", airline:"Vistara",   from:"Hyderabad", to:"Delhi",  fromCode:"HYD", toCode:"DEL", depTime:"18:00", arrTime:"20:20", duration:"2h 20m", fare:9200, seatsLeft:3,  routeFreq:"medium", availFlights:8  },
  // BOM → BLR
  { flightNo:"UK-820", airline:"Vistara",   from:"Mumbai",    to:"Bangalore", fromCode:"BOM", toCode:"BLR", depTime:"06:30", arrTime:"08:05", duration:"1h 35m", fare:7400,  seatsLeft:5,  routeFreq:"high",   availFlights:15 },
  { flightNo:"6E-500", airline:"IndiGo",    from:"Mumbai",    to:"Bangalore", fromCode:"BOM", toCode:"BLR", depTime:"11:45", arrTime:"13:25", duration:"1h 40m", fare:4600,  seatsLeft:22, routeFreq:"high",   availFlights:15 },
  { flightNo:"AI-618", airline:"Air India", from:"Mumbai",    to:"Bangalore", fromCode:"BOM", toCode:"BLR", depTime:"15:10", arrTime:"16:50", duration:"1h 40m", fare:5800,  seatsLeft:11, routeFreq:"high",   availFlights:15 },
  // DEL → GOI
  { flightNo:"SG-112", airline:"SpiceJet",  from:"Delhi",     to:"Goa",    fromCode:"DEL", toCode:"GOI", depTime:"08:00", arrTime:"10:25", duration:"2h 25m", fare:4100, seatsLeft:8,  routeFreq:"low",    availFlights:3  },
  { flightNo:"6E-730", airline:"IndiGo",    from:"Delhi",     to:"Goa",    fromCode:"DEL", toCode:"GOI", depTime:"14:30", arrTime:"16:55", duration:"2h 25m", fare:3800, seatsLeft:15, routeFreq:"low",    availFlights:3  },
];

// ─── REFUND TIERS ─────────────────────────────────────────────────────────────
export const POLICY_TIERS = [
  { min: 60, max: 9999, label: "60+ days before",   pct: 95, color: "#00c896" },
  { min: 30, max: 59,   label: "30–59 days before", pct: 80, color: "#7ecb6e" },
  { min: 15, max: 29,   label: "15–29 days before", pct: 60, color: "#f5c842" },
  { min: 7,  max: 14,   label: "7–14 days before",  pct: 40, color: "#f5a623" },
  { min: 3,  max: 6,    label: "3–6 days before",   pct: 20, color: "#e8533a" },
  { min: 0,  max: 2,    label: "0–2 days before",   pct: 5,  color: "#c0392b" },
];

export const RULES = [
  "Cancellation must be requested at least 2 hours before scheduled departure.",
  "Refunds are processed within 5–7 business days to the original payment method.",
  "No-show cancellations (after departure) are entirely non-refundable.",
  "Convenience fee of ₹350 is non-refundable under all circumstances.",
  "GST charged on base fare is refundable if the base fare refund is approved.",
  "Business class carries an additional flat cancellation charge of ₹2,000.",
  "Partial refunds apply if only one leg of a round-trip is cancelled.",
  "Refund may be reduced based on real-time alternate flight availability.",
  "High-frequency routes attract a further 5–10% demand-based adjustment.",
  "All refund claims must be filed through the official portal within 48 hrs.",
];

export const CANCEL_STEPS = [
  { title: "Open My Bookings",          desc: "Navigate to the Home page and click the booking you want to cancel." },
  { title: "Review the Refund Timeline", desc: "Use the interactive timeline slider on the Refund tab to see how cancelling today affects your payout." },
  { title: "Select Initiate Cancellation", desc: "Click the red Initiate Cancellation button on the Cancellation tab and verify your identity via OTP." },
  { title: "Confirm & Accept Terms",    desc: "Read the summary screen showing exact deductions, then confirm. This action is irreversible." },
  { title: "Await Refund Credit",       desc: "Refund is credited within 5–7 business days. You will receive SMS and email confirmation." },
];
