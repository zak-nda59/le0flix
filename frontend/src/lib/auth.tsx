"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/api";

type AuthUser = {
    id: string;
    email: string;
    role: string;
    displayName?: string | null;
};

type AuthContextValue = {
    token: string | null;
    user: AuthUser | null;
    loading: boolean;
    setToken: (token: string | null) => void;
    logout: () => void;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "le0flix_access_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const setToken = useCallback((next: string | null) => {
        setTokenState(next);
        if (!next) {
            localStorage.removeItem(STORAGE_KEY);
        } else {
            localStorage.setItem(STORAGE_KEY, next);
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
    }, [setToken]);

    const refresh = useCallback(async () => {
        const t = token ?? localStorage.getItem(STORAGE_KEY);
        if (!t) {
            setUser(null);
            return;
        }

        try {
            const me = await apiJson<{ id: string; email: string; role: string }>("/auth/me", {
                method: "GET",
                token: t,
            });
            setUser({ ...me, displayName: null });
        } catch {
            logout();
        }
    }, [logout, token]);

    useEffect(() => {
        const existing = localStorage.getItem(STORAGE_KEY);
        setTokenState(existing);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) void refresh();
    }, [loading, refresh]);

    const value = useMemo<AuthContextValue>(
        () => ({ token, user, loading, setToken, logout, refresh }),
        [token, user, loading, setToken, logout, refresh],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
