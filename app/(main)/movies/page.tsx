"use client";

import { usePopularMovies } from "@/modules/tmdb/hooks/useMovies";
import { useFavorites } from "@/modules/favorites/hooks/useFavorites";
import { useWatchlist } from "@/modules/watchlist/hooks/useWatchlist";
import { MediaGrid } from "@/shared/components/MediaGrid";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { MediaType } from "@/domain/enums/media-type.enum";
import { ContentReferencePayload } from "@/domain/types/content.types";
import { TmdbMovie } from "@/domain/types/tmdb.types";
import { GenreFilter } from "@/modules/tmdb/components/GenreFilter";
import { useInfiniteScroll } from "@/shared/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";

export default function MoviesPage() {
  const { items, loading, loadingMore, hasMore, totalResults, loadMore, selectedGenres, toggleGenre, clearGenres } = usePopularMovies();
  const { isFavorite, getFavoriteId, add: addFav, remove: removeFav } = useFavorites();
  const { isInWatchlist, add: addWatch } = useWatchlist();

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loadingMore);

  function buildContent(item: TmdbMovie): ContentReferencePayload {
    return { tmdb_id: item.id, media_type: MediaType.Movie, title: item.title, poster_path: item.poster_path };
  }

  async function handleFavorite(item: TmdbMovie) {
    const fid = getFavoriteId(item.id);
    fid ? await removeFav(fid) : await addFav(buildContent(item));
  }

  return (
    <div>
      <SectionHeader
        title="Filmes Populares"
      />

      <GenreFilter selected={selectedGenres} onToggle={toggleGenre} onClear={clearGenres} />

      <MediaGrid
        items={items}
        loading={loading}
        mediaType={MediaType.Movie}
        isFavorite={(id) => isFavorite(id)}
        isInWatchlist={(id) => isInWatchlist(id)}
        onFavorite={handleFavorite}
        onWatchlist={(item) => addWatch(buildContent(item as TmdbMovie))}
      />

      <div ref={sentinelRef} className="h-4" />

      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-xs text-muted-foreground py-8">
          Você chegou ao fim — {items.length} filmes carregados
        </p>
      )}
    </div>
  );
}
