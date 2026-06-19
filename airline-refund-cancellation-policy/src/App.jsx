import React, { useState } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Navbar      from "./components/Navbar";
import Login       from "./pages/Login";
import Signup      from "./pages/Signup";
import Home        from "./pages/Home";
import BookFlight  from "./pages/BookFlight";
import RefundPage  from "./pages/RefundPage";
import { BOOKINGS } from "./data/mockData";
import "./index.css";

function Inner() {
  const { user } = useAuth();
  const [page,            setPage]            = useState("login");
  const [selectedBooking, setSelectedBooking] = useState(null);
  // Bookings created this session (via BookFlight) stored here
  const [sessionBookings, setSessionBookings] = useState([]);

  const safePage = !user && page !== "signup" ? "login" : page;

  /** Called by BookFlight when user confirms a booking */
  function handleNewBooking(booking) {
    // Push into runtime BOOKINGS array so Home picks it up
    BOOKINGS.push(booking);
    setSessionBookings((prev) => [...prev, booking]);
    setSelectedBooking(booking);
  }

  return (
    <>
      <Navbar setPage={setPage} />

      {safePage === "login"  && <Login  setPage={setPage} />}
      {safePage === "signup" && <Signup setPage={setPage} />}

      {safePage === "home" && user && (
        <Home
          setPage={setPage}
          setSelectedBooking={setSelectedBooking}
          extraBookings={sessionBookings}
        />
      )}

      {safePage === "book" && user && (
        <BookFlight
          setPage={setPage}
          onBookingConfirmed={handleNewBooking}
        />
      )}

      {safePage === "refund" && user && selectedBooking && (
        <RefundPage
          booking={selectedBooking}
          setPage={setPage}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
