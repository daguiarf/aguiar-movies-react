"use client";

import { useWatchlist } from "@/modules/watchlist/hooks/useWatchlist";
import { MediaCard } from "@/shared/components/MediaCard";
import { PageHeader } from "@/shared/components/PageHeader";
import { Bookmark, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function WatchlistPage() {
  const { items, loading, remove, markWatched } = useWatchlist();

  const unwatched = items.filter((i) => !i.watched);
  const watched = items.filter((i) => i.watched);

  return (
    <div>
      <PageHeader
        title="Minha Watchlist"
        description={items.length > 0 ? `${items.length} itens · ${watched.length} assistidos` : undefined}
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
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Bookmark className="w-16 h-16 text-muted-foreground/30" />
          <div>
            <p className="text-lg font-semibold">Watchlist vazia</p>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione filmes e séries para assistir depois
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {unwatched.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4">Para assistir ({unwatched.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {unwatched.map((item) => (
                  <div key={item.id} className="relative group">
                    <MediaCard
                      id={item.content.tmdb_id}
                      title={item.content.title}
                      posterPath={item.content.poster_path}
                      mediaType={item.content.media_type}
                    />
                    <div className="flex gap-1 mt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs gap-1"
                        onClick={() => markWatched(item.id, true)}
                      >
                        <Check className="w-3 h-3" />
                        Assisti
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => remove(item.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {watched.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
                Assistidos ({watched.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 opacity-70">
                {watched.map((item) => (
                  <div key={item.id} className="relative">
                    <MediaCard
                      id={item.content.tmdb_id}
                      title={item.content.title}
                      posterPath={item.content.poster_path}
                      mediaType={item.content.media_type}
                    />
                    <div className="absolute top-2 left-2 bg-green-500/90 rounded-full p-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full h-7 text-xs mt-1 text-destructive hover:text-destructive"
                      onClick={() => remove(item.id)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
