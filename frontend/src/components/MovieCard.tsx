import Link from "next/link";
import type { Movie } from "@/lib/types";

function initials(title: string) {
    return title
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");
}

function gradientForId(id: string) {
    const n = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const a = n % 360;
    const b = (a + 35) % 360;
    return `linear-gradient(135deg, hsla(${a}, 80%, 45%, 0.95), hsla(${b}, 80%, 35%, 0.95))`;
}

export function MovieCard({ movie }: { movie: Movie }) {
    const poster = movie.thumbnailUrl ?? movie.backdropUrl;

    return (
        <Link
            href={`/movie/${movie.id}`}
            className="group relative aspect-video w-[220px] shrink-0 overflow-hidden rounded-md border border-white/10 bg-zinc-950 transition hover:z-10 hover:scale-[1.06] hover:border-white/25 hover:shadow-2xl sm:w-[280px]"
        >
            {poster ? (
                <img
                    src={poster}
                    alt={movie.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : null}

            {!poster ? (
                <div
                    className="absolute inset-0"
                    style={{ backgroundImage: gradientForId(movie.id) }}
                />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/80" />

            {!poster ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-sm font-semibold text-zinc-200">
                        {initials(movie.title)}
                    </div>
                </div>
            ) : null}

            <div className="absolute inset-x-0 bottom-0 p-3">
                <div className="text-sm font-semibold leading-5 text-white">
                    {movie.title}
                </div>
                <div className="mt-1 text-xs text-zinc-300">
                    {movie.releaseYear ?? "—"} · {movie.maturityRating ?? "—"}
                </div>
            </div>

            <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 bg-black/15" />
            </div>
        </Link>
    );
}
