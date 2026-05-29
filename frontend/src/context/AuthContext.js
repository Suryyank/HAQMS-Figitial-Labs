// "use client";

// import React, { createContext, useState, useEffect, useContext } from "react";
// import { useRouter } from "next/navigation";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const router = useRouter();

//   // HARDCODED API VALUE: Intentionally hardcoding the backend base URL on the frontend!
//   // This violates production standards and prevents simple domain config, but serves as
//   // a perfect exercise for internship candidates to move to environment variables.
//   const API_BASE_URL = "http://localhost:5001/api";

//   useEffect(() => {
//     // Check for stored token and user on initialization
//     const storedToken = localStorage.getItem("haqms_token");
//     const storedUser = localStorage.getItem("haqms_user");

//     if (storedToken && storedUser) {
//       try {
//         setToken(storedToken);
//         setUser(JSON.parse(storedUser));
//       } catch (e) {
//         console.error("Failed to parse user details from localStorage", e);
//         logout();
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = async (email, password) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Authentication failed");
//       }

//       // Inconsistent API returns nested success format for login
//       const receivedToken = data.data.token;
//       const receivedUser = data.data.user;

//       // SECURITY ISSUE: Storing sensitive auth credentials directly in LocalStorage!
//       localStorage.setItem("haqms_token", receivedToken);
//       localStorage.setItem("haqms_user", JSON.stringify(receivedUser));

//       setToken(receivedToken);
//       setUser(receivedUser);

//       router.push("/dashboard");
//       return { success: true };
//     } catch (err) {
//       console.error("[AUTH-ERROR] Login request failed:", err);
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (name, email, password, role = "RECEPTIONIST") => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, email, password, role }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Registration failed");
//       }

//       // If registration succeeds, log them in automatically or redirect to login.
//       // Notice inconsistency: signup API returns flat user structure inside "user"
//       // we can trigger login for them.
//       return login(email, password);
//     } catch (err) {
//       setError(err.message);
//       return { success: false, error: err.message };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("haqms_token");
//     localStorage.removeItem("haqms_user");
//     setToken(null);
//     setUser(null);
//     router.push("/login");
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         token,
//         loading,
//         error,
//         login,
//         register,
//         logout,
//         API_BASE_URL, // Exposing hardcoded API base URL for convenience
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  loginService,
  registerService,
} from "@/features/auth/services/auth.services";
import { authStorage } from "@/features/auth/utils/auth-storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =====================================
  // SESSION RESTORATION
  // =====================================

  useEffect(() => {
    try {
      const storedToken = authStorage.getToken();
      const storedUser = authStorage.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);

        setUser(storedUser);
      }
    } catch (error) {
      console.error("[AUTH_INIT_ERROR]", error);

      authStorage.clearSession();
    } finally {
      setLoading(false);
    }
  }, []);

  // =====================================
  // LOGIN
  // =====================================

  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true);

        setError(null);

        const session = await loginService({
          email,
          password,
        });

        authStorage.setSession(session);

        setToken(session.token);

        setUser(session.user);

        router.push("/dashboard");

        return {
          success: true,
        };
      } catch (error) {
        console.error("[LOGIN_ERROR]", error);

        setError(error.message);

        return {
          success: false,
          error: error.message,
        };
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  // =====================================
  // REGISTER
  // =====================================

  const register = useCallback(
    async (name, email, password, role = "RECEPTIONIST") => {
      try {
        setLoading(true);

        setError(null);

        await registerService({
          name,
          email,
          password,
          role,
        });

        return await login(email, password);
      } catch (error) {
        console.error("[REGISTER_ERROR]", error);

        setError(error.message);

        return {
          success: false,
          error: error.message,
        };
      } finally {
        setLoading(false);
      }
    },
    [login],
  );

  // =====================================
  // LOGOUT
  // =====================================

  const logout = useCallback(() => {
    authStorage.clearSession();

    setUser(null);

    setToken(null);

    router.replace("/login");
  }, [router]);

  // =====================================
  // MEMOIZED CONTEXT
  // =====================================

  const value = useMemo(
    () => ({
      user,
      token,

      loading,
      error,

      login,
      register,
      logout,
    }),

    [user, token, loading, error, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
