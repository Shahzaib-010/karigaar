"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMe, type ApiUser, type RoleName } from "@/src/lib/api";

export interface User extends ApiUser {
  // Client-only fields the backend doesn't persist (kept in localStorage).
  city?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True until the boot-time /me rehydrate settles. */
  isLoading: boolean;
  roles: RoleName[];
  permissions: string[];
  can: (permission: string) => boolean;
  hasRole: (role: RoleName) => boolean;
  login: (user: User, token?: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "karigaar_user";
const TOKEN_STORAGE_KEY = "karigaar_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Load persisted session, then refresh it from /me so roles/permissions
  // reflect any server-side change since last login.
  //
  // The synchronous setState here hydrates from localStorage on mount. A lazy
  // useState initializer can't do this SSR-safely (window is absent on the
  // server → hydration mismatch), so the effect is the correct place.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedUser = window.localStorage.getItem(STORAGE_KEY);
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);

    let activeToken = storedToken;

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as
          | User
          | { user?: User; token?: string | null };

        if (parsed && "user" in parsed && parsed.user) {
          setUser(parsed.user);
          activeToken = parsed.token ?? storedToken;
        } else {
          setUser(parsed as User);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }

    if (!activeToken) {
      setIsLoading(false);
      return;
    }

    setToken(activeToken);

    let cancelled = false;
    getMe(activeToken)
      .then((fresh) => {
        if (cancelled) return;
        setUser((prev) => {
          const merged: User = { ...prev, ...fresh };
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ user: merged, token: activeToken }),
          );
          return merged;
        });
      })
      .catch(() => {
        // Token rejected / expired — drop the stale session.
        if (!cancelled) logout();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [logout]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const roles = useMemo(() => user?.roles ?? [], [user]);
  const permissions = useMemo(() => user?.permissions ?? [], [user]);

  const can = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions],
  );
  const hasRole = useCallback(
    (role: RoleName) => roles.includes(role),
    [roles],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isLoading,
      roles,
      permissions,
      can,
      hasRole,
      login,
      logout,
    }),
    [user, token, isLoading, roles, permissions, can, hasRole, login, logout],
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
