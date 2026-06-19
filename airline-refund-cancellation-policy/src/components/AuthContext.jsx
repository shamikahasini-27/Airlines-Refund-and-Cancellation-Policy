import React, { createContext, useContext, useState } from "react";
import { USERS } from "../data/mockData";

const AuthContext = createContext(null);

// Keep a mutable copy so signup can push new users during the session
const DB = [...USERS];

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [error, setError] = useState("");

  const login = (email, password) => {
    const found = DB.find((u) => u.email === email && u.password === password);
    if (found) { setUser(found); setError(""); return true; }
    setError("Invalid email or password.");
    return false;
  };

  const signup = (name, email, password) => {
    if (DB.find((u) => u.email === email)) {
      setError("An account with this email already exists.");
      return false;
    }
    const nu = {
      id: DB.length + 1,
      email, password, name,
      avatar: name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
    };
    DB.push(nu);
    setUser(nu);
    setError("");
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
