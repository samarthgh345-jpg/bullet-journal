import { createContext, useContext, useState } from "react";

import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("bulletJournalUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("bulletJournalToken");
  });

  /* =========================
     REGISTER
  ========================= */

  const register = async (name, email, password) => {
    const data = await registerUser({
      name,
      email,
      password,
    });

    localStorage.setItem("bulletJournalToken", data.token);
    localStorage.setItem("bulletJournalUser", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  /* =========================
     LOGIN
  ========================= */

  const login = async (email, password) => {
    const data = await loginUser({
      email,
      password,
    });

    localStorage.setItem("bulletJournalToken", data.token);
    localStorage.setItem("bulletJournalUser", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.removeItem("bulletJournalToken");
    localStorage.removeItem("bulletJournalUser");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        register,
        login,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useAuth = () => {
  return useContext(AuthContext);
};
