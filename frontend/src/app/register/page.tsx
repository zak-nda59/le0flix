"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, type FormEvent, useState } from "react";
import { apiJson } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { AuthResponse } from "@/lib/types";

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-black text-white">
                    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
                        <Link href="/" className="mb-10 text-2xl font-semibold tracking-tight">
                            Le0flix
                        </Link>
                        <div className="rounded-md border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                            Chargement...
                        </div>
                    </div>
                </div>
            }
        >
            <RegisterPageInner />
        </Suspense>
    );
}

function RegisterPageInner() {
    const router = useRouter();
    const search = useSearchParams();
    const { setToken, refresh } = useAuth();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await apiJson<AuthResponse>("/auth/register", {
                method: "POST",
                body: JSON.stringify({ displayName, email, password }),
            });
            setToken(res.accessToken);
            await refresh();

            const redirect = search.get("redirect");
            router.push(redirect ? redirect : "/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
                <Link href="/" className="mb-10 text-2xl font-semibold tracking-tight">
                    Le0flix
                </Link>

                <h1 className="text-3xl font-semibold">Créer un compte</h1>
                <p className="mt-2 text-sm text-zinc-400">
                    Inscris-toi pour commencer.
                </p>

                <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
                    <input
                        className="h-12 rounded-md border border-zinc-800 bg-zinc-950 px-4 outline-none focus:border-zinc-500"
                        placeholder="Nom d'affichage"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                    <input
                        className="h-12 rounded-md border border-zinc-800 bg-zinc-950 px-4 outline-none focus:border-zinc-500"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="h-12 rounded-md border border-zinc-800 bg-zinc-950 px-4 outline-none focus:border-zinc-500"
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error ? (
                        <div className="rounded-md border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-12 rounded-md bg-red-600 font-semibold text-white hover:bg-red-500 disabled:opacity-70"
                    >
                        {loading ? "Création..." : "Créer le compte"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-zinc-400">
                    Déjà un compte ?{" "}
                    <Link href="/login" className="text-white underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}
