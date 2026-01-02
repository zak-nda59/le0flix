"use client";

import Hls from "hls.js";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";

export default function WatchPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-black text-white">
                    <Header />
                    <main className="mx-auto max-w-6xl px-6 pb-10 pt-8">
                        <h1 className="text-lg font-semibold">Lecture</h1>
                        <div className="mt-6 rounded-md border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                            Chargement...
                        </div>
                    </main>
                </div>
            }
        >
            <WatchPageInner />
        </Suspense>
    );
}

function WatchPageInner() {
    const params = useSearchParams();
    const src = params.get("src");

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    const safeSrc = useMemo(() => {
        if (!src) return null;
        try {
            const url = new URL(src);
            return url.toString();
        } catch {
            return null;
        }
    }, [src]);

    useEffect(() => {
        setError(null);

        const video = videoRef.current;
        if (!video || !safeSrc) return;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = safeSrc;
            return;
        }

        if (!Hls.isSupported()) {
            setError(
                "Ton navigateur ne supporte pas HLS. Essaie avec Safari ou active Hls.js (Edge/Chrome devraient marcher).",
            );
            return;
        }

        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
        });

        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(safeSrc);
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
            if (data?.fatal) {
                setError(`Erreur HLS: ${data.type}`);
                hls.destroy();
            }
        });

        return () => {
            hls.destroy();
        };
    }, [safeSrc]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="mx-auto max-w-6xl px-6 pb-10 pt-8">
                <h1 className="text-lg font-semibold">Lecture</h1>

                <div className="mt-3 text-xs text-zinc-400">
                    Route legacy. Préfère <span className="font-mono">/watch/&lt;movieId&gt;</span>.
                </div>

                {!safeSrc ? (
                    <div className="mt-6 rounded-md border border-yellow-900/60 bg-yellow-950/30 px-4 py-3 text-sm text-yellow-200">
                        Source manquante ou invalide. Retourne sur la fiche d’un film et clique “Regarder”.
                    </div>
                ) : null}

                {error ? (
                    <div className="mt-6 rounded-md border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                ) : null}

                <div className="mt-6 overflow-hidden rounded-md border border-white/10 bg-black">
                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        className="aspect-video w-full"
                    />
                </div>

                {safeSrc ? (
                    <div className="mt-4 text-xs text-zinc-400">
                        Source: <span className="font-mono">{safeSrc}</span>
                    </div>
                ) : null}
            </main>
        </div>
    );
}
