import type { Movie } from "@/lib/types";
import { API_BASE_URL } from "@/lib/api";
import { Header } from "@/components/Header";
import { MovieRow } from "@/components/MovieRow";

function groupByCategory(movies: Movie[]) {
  const map = new Map<string, { title: string; movies: Movie[] }>();

  for (const movie of movies) {
    if (!movie.categories?.length) {
      const key = "tendances";
      const row = map.get(key) ?? { title: "Tendances", movies: [] };
      row.movies.push(movie);
      map.set(key, row);
      continue;
    }

    for (const c of movie.categories) {
      const key = c.slug ?? c.name;
      const row = map.get(key) ?? { title: c.name, movies: [] };
      row.movies.push(movie);
      map.set(key, row);
    }
  }

  return Array.from(map.values());
}

export default async function Home() {
  let movies: Movie[] = [];
  let backendOk = false;
  try {
    const res = await fetch(`${API_BASE_URL}/movies`, { cache: "no-store" });
    backendOk = res.ok;
    movies = (res.ok ? ((await res.json()) as Movie[]) : []).filter(Boolean).slice(0, 50);
  } catch {
    backendOk = false;
    movies = [];
  }

  const rows = groupByCategory(movies);
  const hero = movies[0];
  const heroBackdrop = hero?.backdropUrl ?? hero?.thumbnailUrl ?? null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            {heroBackdrop ? (
              <div
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${heroBackdrop})` }}
              />
            ) : null}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black" />
          </div>

          <div className="relative flex min-h-[72vh] items-end px-10 pb-16 pt-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                {hero?.title ?? "Le0flix"}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-200">
                <span className="font-semibold text-white">★ 7.4</span>
                <span>{hero?.releaseYear ?? "—"}</span>
                <span>{hero?.durationMinutes ? `${hero.durationMinutes} min` : "—"}</span>
                <span className="rounded-sm border border-white/20 px-2 py-0.5 text-xs text-white">
                  {hero?.maturityRating ?? "—"}
                </span>
              </div>

              {hero?.categories?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {hero.categories.slice(0, 4).map((c) => (
                    <span
                      key={c.id}
                      className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-zinc-100"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              ) : null}

              <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-200 md:text-base">
                {hero?.synopsis ??
                  "Une expérience de streaming moderne: catalogue, fiches films, session sécurisée et player HLS."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={hero ? `/movie/${hero.id}` : "#catalogue"}
                  className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
                >
                  <span aria-hidden>▶</span>
                  Lire la bande-annonce
                </a>
                <a
                  href={hero ? `/movie/${hero.id}` : "#catalogue"}
                  className="inline-flex items-center gap-2 rounded-md bg-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
                >
                  <span aria-hidden>ℹ</span>
                  Plus d’infos
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="catalogue" className="px-10 pb-16">
          {!backendOk ? (
            <div className="rounded-md border border-yellow-900/60 bg-yellow-950/30 px-4 py-3 text-sm text-yellow-200">
              Backend indisponible sur {API_BASE_URL}. Lance le serveur NestJS sur le port 4000.
            </div>
          ) : null}

          {rows.length === 0 ? (
            <div className="mt-10 text-sm text-zinc-400">
              Aucun film publié pour le moment.
            </div>
          ) : (
            <div className="mt-10 flex flex-col gap-10">
              {rows.map((row) => (
                <MovieRow key={row.title} title={row.title} movies={row.movies.slice(0, 20)} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
