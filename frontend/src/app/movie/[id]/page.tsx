import Link from "next/link";
import { notFound } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import type { Movie } from "@/lib/types";
import { Header } from "@/components/Header";
import { PlayButton } from "./PlayButton";
import { TrailerButton } from "./TrailerButton";

export default async function MoviePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const res = await fetch(`${API_BASE_URL}/movies/${encodeURIComponent(id)}`, {
        cache: "no-store",
    });

    if (res.status === 404) return notFound();

    const movie = (res.ok ? ((await res.json()) as Movie) : null) as Movie | null;
    if (!movie) return notFound();

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
                <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight">{movie.title}</h1>

                        <div className="mt-3 text-sm text-zinc-400">
                            {movie.releaseYear ?? "—"} · {movie.durationMinutes ?? "—"} min ·{" "}
                            {movie.maturityRating ?? "—"}
                        </div>

                        {movie.categories?.length ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {movie.categories.map((c) => (
                                    <span
                                        key={c.id}
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
                                    >
                                        {c.name}
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        <p className="mt-6 max-w-3xl text-sm leading-6 text-zinc-200 md:text-base">
                            {movie.synopsis ?? "Aucun synopsis."}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={`/watch/${movie.id}`}
                                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
                            >
                                Regarder maintenant
                            </Link>
                            <TrailerButton movieId={movie.id} />
                        </div>

                        <div className="mt-10">
                            <PlayButton movieId={movie.id} />
                        </div>

                        <div className="mt-10 text-sm text-zinc-400">
                            <div className="font-semibold text-zinc-200">HLS base path</div>
                            <div className="mt-1 font-mono text-xs text-zinc-400">{movie.hlsBasePath}</div>
                        </div>
                    </div>

                    <aside className="rounded-md border border-white/10 bg-zinc-950 p-5">
                        <div className="text-sm font-semibold">À propos</div>
                        <div className="mt-3 text-sm text-zinc-300">
                            Cette page prépare la lecture HLS via une session sécurisée.
                        </div>
                        <div className="mt-6 text-xs text-zinc-400">
                            Endpoint films: <span className="font-mono">GET /movies</span>
                            <br />
                            Session: <span className="font-mono">POST /stream/sessions</span>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
