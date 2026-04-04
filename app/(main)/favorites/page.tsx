"use client";

import { useFavorites } from "@/modules/favorites/hooks/useFavorites";
import { MediaCard } from "@/shared/components/MediaCard";
import { PageHeader } from "@/shared/components/PageHeader";
import { buildImageUrl, formatYear } from "@/shared/utils/tmdb.utils";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesPage() {
  const { favorites, loading, remove } = useFavorites();

  return (
    <div>
      <PageHeader
        title="Meus Favoritos"
        description={favorites.length > 0 ? `${favorites.length} itens favoritados` : undefined}
      />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Heart className="w-16 h-16 text-muted-foreground/30" />
          <div>
            <p className="text-lg font-semibold">Nenhum favorito ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Explore filmes e séries e adicione seus favoritos
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map((fav) => (
            <MediaCard
              key={fav.id}
              id={fav.content.tmdb_id}
              title={fav.content.title}
              posterPath={fav.content.poster_path}
              mediaType={fav.content.media_type}
              isFavorite
              onFavorite={() => remove(fav.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
