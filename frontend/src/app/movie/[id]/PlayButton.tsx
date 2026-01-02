"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";

export function PlayButton({ movieId }: { movieId: string }) {
    const router = useRouter();
    const { token } = useAuth();

    const qualities = useMemo(() => ["1080p", "720p", "480p"], []);
    const [quality, setQuality] = useState(qualities[0]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onPlay() {
        setError(null);
        setLoading(true);

        try {
            const t = token ?? localStorage.getItem("le0flix_access_token");
            if (!t) {
                router.push(`/login?redirect=${encodeURIComponent(`/watch/${movieId}`)}`);
                return;
            }

            router.push(`/watch/${encodeURIComponent(movieId)}?quality=${encodeURIComponent(quality)}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-md border border-white/10 bg-zinc-950 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="text-sm font-semibold">Lecture</div>
                    <div className="mt-1 text-xs text-zinc-400">
                        Crée une session sécurisée et lance le player HLS.
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        className="h-10 rounded-md border border-zinc-800 bg-black px-3 text-sm outline-none focus:border-zinc-500"
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                    >
                        {qualities.map((q) => (
                            <option key={q} value={q}>
                                {q}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={onPlay}
                        disabled={loading}
                        className="h-10 rounded-md bg-white px-4 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-70"
                    >
                        {loading ? "Préparation..." : "Regarder"}
                    </button>
                </div>
            </div>

            {error ? (
                <div className="mt-3 rounded-md border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                    {error}
                </div>
            ) : null}

            <div className="mt-3 text-xs text-zinc-400">
                Astuce: si tu n’es pas connecté, tu seras redirigé vers la page de connexion.
            </div>
        </div>
    );
}
