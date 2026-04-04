"use client";

import { MediaCard } from "@/shared/components/MediaCard";
import { MediaType } from "@/domain/enums/media-type.enum";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType;
}

interface MediaGridProps {
  items: MediaItem[];
  loading?: boolean;
  mediaType: MediaType;
  isFavorite?: (id: number) => boolean;
  isInWatchlist?: (id: number) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFavorite?: (item: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onWatchlist?: (item: any) => void;
}

export function MediaGrid({
  items,
  loading,
  mediaType,
  isFavorite,
  isInWatchlist,
  onFavorite,
  onWatchlist,
}: MediaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="h-3 w-3/4 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => {
        const type = item.media_type ?? mediaType;
        const title = item.title ?? item.name ?? "";
        const date = item.release_date ?? item.first_air_date;
        const year = date ? new Date(date).getFullYear().toString() : undefined;

        return (
          <MediaCard
            key={item.id}
            id={item.id}
            title={title}
            posterPath={item.poster_path}
            rating={item.vote_average}
            year={year}
            mediaType={type}
            isFavorite={isFavorite?.(item.id)}
            isInWatchlist={isInWatchlist?.(item.id)}
            onFavorite={onFavorite ? () => onFavorite(item) : undefined}
            onWatchlist={onWatchlist ? () => onWatchlist(item) : undefined}
          />
        );
      })}
    </div>
  );
}
