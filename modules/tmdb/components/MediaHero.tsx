"use client";

import Image from "next/image";
import { Play, Heart, Bookmark, Star, Calendar, Clock, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildBackdropUrl, buildImageUrl, formatDate, formatRuntime, formatYear } from "@/shared/utils/tmdb.utils";
import { TmdbMovie, TmdbTV } from "@/domain/types/tmdb.types";
import { MediaType } from "@/domain/enums/media-type.enum";
import { ContentReferencePayload } from "@/domain/types/content.types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type MediaItem = TmdbMovie | TmdbTV;

function isMovie(item: MediaItem): item is TmdbMovie {
  return "title" in item;
}

interface MediaHeroProps {
  item: MediaItem;
  mediaType: MediaType;
  isFavorite?: boolean;
  isInWatchlist?: boolean;
  onFavorite?: (content: ContentReferencePayload) => void;
  onWatchlist?: (content: ContentReferencePayload) => void;
}

export function MediaHero({
  item,
  mediaType,
  isFavorite,
  isInWatchlist,
  onFavorite,
  onWatchlist,
}: MediaHeroProps) {
  const router = useRouter();
  const [trailerOpen, setTrailerOpen] = useState(false);

  const title = isMovie(item) ? item.title : item.name;
  const releaseDate = isMovie(item) ? item.release_date : item.first_air_date;
  const runtime = isMovie(item) ? item.runtime : undefined;
  const trailer = item.videos?.results.find(
    (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
  );

  const contentRef: ContentReferencePayload = {
    tmdb_id: item.id,
    media_type: mediaType,
    title,
    poster_path: item.poster_path,
  };

  return (
    <>
      <div className="relative min-h-[70vh] sm:min-h-[80vh] flex items-end">
        {/* Backdrop */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={buildBackdropUrl(item.backdrop_path)}
            alt={title}
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>

        {/* Content */}
        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 pb-10 w-full">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Poster */}
            <div className="relative w-32 sm:w-44 shrink-0 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 hidden sm:block">
              <Image
                src={buildImageUrl(item.poster_path)}
                alt={title}
                width={176}
                height={264}
                className="w-full"
              />
            </div>

            {/* Info */}
            <div className="flex-1 max-w-2xl">
              {item.tagline && (
                <p className="text-primary text-sm font-medium mb-1 italic">{item.tagline}</p>
              )}
              <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-2">
                {title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mb-3">
                {item.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                    <Star className="w-4 h-4 fill-yellow-400" />
                    {item.vote_average.toFixed(1)}
                  </span>
                )}
                {releaseDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatYear(releaseDate)}
                  </span>
                )}
                {runtime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatRuntime(runtime)}
                  </span>
                )}
                {item.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="px-2 py-0.5 rounded-full border border-white/20 text-xs"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {item.overview && (
                <p className="text-white/80 text-sm sm:text-base leading-relaxed line-clamp-3 mb-4">
                  {item.overview}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {trailer && (
                  <Button
                    onClick={() => setTrailerOpen(true)}
                    className="gap-2 bg-white text-black hover:bg-white/90 font-semibold shadow-lg"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    Trailer
                  </Button>
                )}
                {onFavorite && (
                  <Button
                    variant="outline"
                    onClick={() => onFavorite(contentRef)}
                    className={cn(
                      "gap-2 border-white/30 text-white hover:bg-white/10",
                      isFavorite && "bg-red-500/20 border-red-400/50 text-red-400"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isFavorite && "fill-red-400")} />
                    {isFavorite ? "Favoritado" : "Favoritar"}
                  </Button>
                )}
                {onWatchlist && (
                  <Button
                    variant="outline"
                    onClick={() => onWatchlist(contentRef)}
                    className={cn(
                      "gap-2 border-white/30 text-white hover:bg-white/10",
                      isInWatchlist && "bg-primary/20 border-primary/50 text-primary"
                    )}
                  >
                    <Bookmark className={cn("w-4 h-4", isInWatchlist && "fill-primary")} />
                    {isInWatchlist ? "Na Watchlist" : "Watchlist"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer modal */}
      {trailerOpen && trailer && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
