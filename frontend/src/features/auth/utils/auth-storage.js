import { AUTH_STORAGE_KEYS } from "../constants/auth.constants";

export const authStorage = {
  getToken() {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  },

  getUser() {
    if (typeof window === "undefined") return null;

    try {
      const rawUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);

      return rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
      console.error("[AUTH_STORAGE_ERROR]", error);

      return null;
    }
  },

  setSession({ token, user }) {
    localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
  },
};
