"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  // Fields returned by GET /api/user.
  email_verified_at?: string | null;
  is_verified?: boolean;
  phone_number?: string | null;
  address?: string | null;
  map_locate?: string | null;
  created_at?: string;
  updated_at?: string;
  // Client-only fields the backend cannot persist yet (kept in localStorage).
  phone?: string;
  city?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token?: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "karigaar_user";
const TOKEN_STORAGE_KEY = "karigaar_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem(STORAGE_KEY);
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);

    if (storedToken) {
      setToken(storedToken);
    }

    if (!storedUser) {
      return;
    }

    try {
      const parsed = JSON.parse(storedUser) as
        | User
        | { user?: User; token?: string | null };

      if ("user" in parsed && parsed.user) {
        setUser(parsed.user);
        if (parsed.token) {
          setToken(parsed.token);
        }
        return;
      }

      setUser(parsed as User);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  const login = useCallback((nextUser: User, nextToken: string | null = null) => {
    setUser(nextUser);
    setToken(nextToken);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: nextUser, token: nextToken }),
    );
    if (nextToken) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [login, logout, token, user],
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
