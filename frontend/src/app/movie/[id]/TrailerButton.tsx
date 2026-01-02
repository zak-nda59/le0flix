"use client";

import { useMemo, useState } from "react";
import { TRAILERS_BY_MOVIE_ID } from "@/lib/trailers";
import { TrailerModal } from "@/components/TrailerModal";

export function TrailerButton({ movieId }: { movieId: string }) {
    const [open, setOpen] = useState(false);

    const trailer = useMemo(() => TRAILERS_BY_MOVIE_ID[String(movieId)], [movieId]);
    if (!trailer) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
                Bande-annonce
            </button>
            {open ? (
                <TrailerModal
                    youtubeVideoId={trailer.youtubeVideoId}
                    title={trailer.title}
                    onClose={() => setOpen(false)}
                />
            ) : null}
        </>
    );
}
