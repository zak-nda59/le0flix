"use client";

import Hls from "hls.js";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, use, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/lib/auth";
import { apiJson } from "@/lib/api";
import type { StreamSessionResponse } from "@/lib/types";

const DEFAULT_QUALITY = "1080p";

export default function WatchMoviePage({ params }: { params: Promise<{ movieId: string }> }) {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-black text-white">
                    <Header />
                    <main className="mx-auto max-w-6xl px-6 pb-10 pt-8">
                        <div className="flex items-center justify-between gap-4">
                            <h1 className="text-lg font-semibold">Lecture</h1>
                        </div>
                        <div className="mt-6 rounded-md border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                            Chargement...
                        </div>
                    </main>
                </div>
            }
        >
            <WatchMoviePageInner params={params} />
        </Suspense>
    );
}

function WatchMoviePageInner({ params }: { params: Promise<{ movieId: string }> }) {
    const router = useRouter();
    const search = useSearchParams();
    const { token } = useAuth();

    const quality = search.get("quality") ?? DEFAULT_QUALITY;

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const { movieId } = use(params);

    const safeUrl = useMemo(() => {
        if (!playbackUrl) return null;
        try {
            return new URL(playbackUrl).toString();
        } catch {
            return null;
        }
    }, [playbackUrl]);

    useEffect(() => {
        setError(null);

        const t = token ?? localStorage.getItem("le0flix_access_token");
        if (!t) {
            router.push(`/login?redirect=${encodeURIComponent(`/watch/${movieId}`)}`);
            return;
        }

        const authToken = t;

        async function run() {
            setLoading(true);
            try {
                const res = await apiJson<StreamSessionResponse>("/stream/sessions", {
                    method: "POST",
                    token: authToken,
                    body: JSON.stringify({ movieId, quality }),
                });
                setPlaybackUrl(res.playbackUrl);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Erreur");
            } finally {
                setLoading(false);
            }
        }

        void run();
    }, [movieId, quality, router, token]);

    useEffect(() => {
        setError(null);

        const video = videoRef.current;
        if (!video || !safeUrl) return;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = safeUrl;
            return;
        }

        if (!Hls.isSupported()) {
            setError("Ton navigateur ne supporte pas HLS.");
            return;
        }

        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.attachMedia(video);
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(safeUrl);
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
    }, [safeUrl]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="mx-auto max-w-6xl px-6 pb-10 pt-8">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-lg font-semibold">Lecture</h1>
                    <button
                        type="button"
                        onClick={() => router.push(`/movie/${movieId}`)}
                        className="rounded-md px-3 py-2 text-sm hover:bg-white/10"
                    >
                        Retour
                    </button>
                </div>

                {loading ? (
                    <div className="mt-6 rounded-md border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
                        Préparation du stream...
                    </div>
                ) : null}

                {error ? (
                    <div className="mt-6 rounded-md border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                ) : null}

                <div className="mt-6 overflow-hidden rounded-md border border-white/10 bg-black">
                    <video ref={videoRef} controls autoPlay className="aspect-video w-full" />
                </div>

                {safeUrl ? (
                    <div className="mt-4 text-xs text-zinc-400">
                        Source: <span className="font-mono">{safeUrl}</span>
                    </div>
                ) : null}
            </main>
        </div>
    );
}
