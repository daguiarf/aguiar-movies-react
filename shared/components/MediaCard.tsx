"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Bookmark, Play } from "lucide-react";
import { buildImageUrl, formatRating } from "@/shared/utils/tmdb.utils";
import { MediaType } from "@/domain/enums/media-type.enum";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  rating?: number;
  year?: string;
  mediaType: MediaType;
  isFavorite?: boolean;
  isInWatchlist?: boolean;
  onFavorite?: () => void;
  onWatchlist?: () => void;
  className?: string;
}

export function MediaCard({
  id,
  title,
  posterPath,
  rating,
  year,
  mediaType,
  isFavorite,
  isInWatchlist,
  onFavorite,
  onWatchlist,
  className,
}: MediaCardProps) {
  const href =
    mediaType === MediaType.Movie
      ? `/movies/${id}`
      : mediaType === MediaType.TV
      ? `/tv/${id}`
      : `/person/${id}`;

  return (
    <div
      className={cn(
        "group relative rounded-xl overflow-hidden bg-card",
        "shadow-md transition-all duration-300",
        "hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:z-10",
        className
      )}
    >
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          {/* Poster */}
          <Image
            src={buildImageUrl(posterPath)}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Hover overlay — blur + gradiente cinematográfico */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              "bg-gradient-to-t from-black/90 via-black/40 to-black/10",
              "backdrop-blur-[1px]"
            )}
          />

          {/* Botão play centralizado */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
            <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>

          {/* Título e meta no hover — parte inferior */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white text-xs font-semibold leading-snug line-clamp-2 drop-shadow">
              {title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {rating !== undefined && rating > 0 && (
                <span className="flex items-center gap-0.5 text-yellow-400 text-xs font-bold">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {formatRating(rating)}
                </span>
              )}
              {year && (
                <span className="text-white/60 text-xs">{year}</span>
              )}
            </div>
          </div>

          {/* Rating badge estático (visível sempre) */}
          {rating !== undefined && rating > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-black/60 backdrop-blur-sm text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md group-hover:opacity-0 transition-opacity duration-200">
              <Star className="w-2.5 h-2.5 fill-yellow-400" />
              {formatRating(rating)}
            </div>
          )}

          {/* Ações — favoritar / watchlist */}
          {(onFavorite || onWatchlist) && (
            <div className="absolute top-2 right-2 flex flex-col gap-1.5 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              {onFavorite && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavorite(); }}
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border shadow-md transition-colors duration-200",
                    isFavorite
                      ? "bg-red-500 border-red-400 text-white"
                      : "bg-black/50 border-white/25 text-white hover:bg-red-500 hover:border-red-400"
                  )}
                  title={isFavorite ? "Remover dos favoritos" : "Favoritar"}
                >
                  <Heart className={cn("w-3.5 h-3.5", isFavorite && "fill-white")} />
                </button>
              )}
              {onWatchlist && (
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWatchlist(); }}
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border shadow-md transition-colors duration-200",
                    isInWatchlist
                      ? "bg-primary border-primary/70 text-white"
                      : "bg-black/50 border-white/25 text-white hover:bg-primary hover:border-primary/70"
                  )}
                  title={isInWatchlist ? "Remover da watchlist" : "Adicionar à watchlist"}
                >
                  <Bookmark className={cn("w-3.5 h-3.5", isInWatchlist && "fill-white")} />
                </button>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Info estática abaixo do poster */}
      <div className="px-2.5 py-2 bg-card">
        <p className="text-xs font-medium text-foreground line-clamp-1 leading-tight tracking-tight">
          {title}
        </p>
        {year && (
          <p className="text-[10px] text-muted-foreground mt-0.5">{year}</p>
        )}
      </div>
    </div>
  );
}
