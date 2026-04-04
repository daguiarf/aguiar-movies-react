export function buildImageUrl(path: string | null, size = "w500"): string {
  if (!path) return "/placeholder-poster.png";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function buildBackdropUrl(path: string | null): string {
  if (!path) return "/placeholder-backdrop.jpg";
  return `https://image.tmdb.org/t/p/original${path}`;
}

export function formatRating(value: number): string {
  return value.toFixed(1);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatYear(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  return new Date(dateStr).getFullYear().toString();
}

export function formatRuntime(minutes: number | undefined): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export function getYoutubeTrailer(videos?: { results: { site: string; type: string; key: string }[] }): string | null {
  if (!videos?.results) return null;
  const trailer = videos.results.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
}
