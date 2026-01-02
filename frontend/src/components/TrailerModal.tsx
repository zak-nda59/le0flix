"use client";

import { useEffect } from "react";

export function TrailerModal({
    youtubeVideoId,
    title,
    onClose,
}: {
    youtubeVideoId: string;
    title?: string;
    onClose: () => void;
}) {
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" onClick={onClose}>
            <div
                className="w-full max-w-4xl overflow-hidden rounded-md border border-white/10 bg-black"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="text-sm font-semibold">{title ?? "Bande-annonce"}</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md px-3 py-2 text-sm hover:bg-white/10"
                    >
                        Fermer
                    </button>
                </div>

                <div className="relative aspect-video w-full">
                    <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${encodeURIComponent(youtubeVideoId)}?autoplay=1&rel=0`}
                        title={title ?? "Trailer"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
