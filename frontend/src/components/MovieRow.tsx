"use client";

import type { Movie } from "@/lib/types";
import { MovieCard } from "@/components/MovieCard";
import { useMemo, useRef } from "react";

export function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
    const railRef = useRef<HTMLDivElement | null>(null);

    const scrollByPx = useMemo(() => 900, []);

    function scrollLeft() {
        railRef.current?.scrollBy({ left: -scrollByPx, behavior: "smooth" });
    }

    function scrollRight() {
        railRef.current?.scrollBy({ left: scrollByPx, behavior: "smooth" });
    }

    return (
        <section className="group/row">
            <div className="flex items-end justify-between">
                <h2 className="text-lg font-semibold tracking-wide text-white">{title}</h2>
                <div className="hidden gap-2 md:flex">
                    <button
                        type="button"
                        onClick={scrollLeft}
                        className="h-9 w-9 rounded-md border border-white/10 bg-white/5 text-sm text-white opacity-0 transition hover:bg-white/10 group-hover/row:opacity-100"
                        aria-label="Scroll left"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={scrollRight}
                        className="h-9 w-9 rounded-md border border-white/10 bg-white/5 text-sm text-white opacity-0 transition hover:bg-white/10 group-hover/row:opacity-100"
                        aria-label="Scroll right"
                    >
                        ›
                    </button>
                </div>
            </div>

            <div className="relative mt-4">
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent" />

                <div
                    ref={railRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {movies.map((m) => (
                        <MovieCard key={m.id} movie={m} />
                    ))}
                </div>
            </div>
        </section>
    );
}
