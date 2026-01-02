"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [solid, setSolid] = useState(false);
    const [open, setOpen] = useState(false);
    const [logoOk, setLogoOk] = useState(false);

    const initials = useMemo(() => {
        const email = user?.email ?? "";
        return email ? email[0]?.toUpperCase() : "U";
    }, [user?.email]);

    useEffect(() => {
        function onScroll() {
            setSolid(window.scrollY > 16);
        }
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setLogoOk(true);
        img.onerror = () => setLogoOk(false);
        img.src = "/logo.png";
    }, []);

    return (
        <header
            className={
                "sticky top-0 z-40 transition-colors " +
                (solid
                    ? "bg-black/90 backdrop-blur border-b border-white/10"
                    : "bg-transparent")
            }
        >
            <div className="mx-auto flex w-full items-center justify-between gap-6 px-10 py-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3">
                        {logoOk ? (
                            <img
                                src="/logo.png"
                                alt="Le0flix"
                                className="h-14 w-auto select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] md:h-16"
                                draggable={false}
                                onError={() => setLogoOk(false)}
                            />
                        ) : (
                            <span className="text-xl font-semibold tracking-tight text-white">Le0flix</span>
                        )}
                    </Link>

                    <nav className="hidden items-center gap-1 text-sm text-zinc-200 md:flex">
                        <Link href="/" className="rounded-md px-3 py-2 hover:bg-white/10">
                            Accueil
                        </Link>
                        <Link href="#catalogue" className="rounded-md px-3 py-2 hover:bg-white/10">
                            Films
                        </Link>
                        <button type="button" className="rounded-md px-3 py-2 hover:bg-white/10">
                            Séries
                        </button>
                        <button type="button" className="rounded-md px-3 py-2 hover:bg-white/10">
                            Nouveautés
                        </button>
                        <button type="button" className="rounded-md px-3 py-2 hover:bg-white/10">
                            Ma liste
                        </button>
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 md:flex">
                        <div className="relative">
                            <input
                                className="h-8 w-60 rounded-sm border border-white/15 bg-black/40 pl-9 pr-3 text-sm text-white placeholder:text-zinc-400 outline-none focus:border-white/30"
                                placeholder="Rechercher"
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-zinc-300">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-200 hover:bg-white/10"
                            aria-label="Notifications"
                        >
                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 17h5l-1.4-1.4A2 2 0 0118 14.17V11a6 6 0 10-12 0v3.17a2 2 0 01-.6 1.43L4 17h5m6 0a3 3 0 11-6 0"
                                />
                            </svg>
                        </button>
                    </div>

                    {user ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setOpen((v) => !v)}
                                className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10"
                            >
                                {initials}
                            </button>

                            {open ? (
                                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-white/10 bg-black/95 shadow-xl">
                                    <div className="px-4 py-3 text-xs text-zinc-300">
                                        Connecté en tant que
                                        <div className="mt-1 truncate text-sm font-semibold text-white">
                                            {user.email}
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            logout();
                                            setOpen(false);
                                            if (pathname?.startsWith("/watch")) router.push("/");
                                        }}
                                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10"
                                    >
                                        Déconnexion
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="rounded-md px-3 py-2 text-sm hover:bg-white/10">
                                Connexion
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
                            >
                                Inscription
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
