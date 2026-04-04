"use client";

import { use } from "react";
import { useMovieDetails } from "@/modules/tmdb/hooks/useMovies";
import { useFavorites } from "@/modules/favorites/hooks/useFavorites";
import { useWatchlist } from "@/modules/watchlist/hooks/useWatchlist";
import { MediaHero } from "@/modules/tmdb/components/MediaHero";
import { CastSection } from "@/modules/tmdb/components/CastSection";
import { ReviewsSection } from "@/modules/reviews/components/ReviewsSection";
import { CreateForumPostModal } from "@/modules/forum/components/CreateForumPostModal";
import { forumService } from "@/services/forum.service";
import { MediaType } from "@/domain/enums/media-type.enum";
import { ContentReferencePayload } from "@/domain/types/content.types";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/shared/components/SectionHeader";

interface Props {
  params: Promise<{ id: string }>;
}

export default function MovieDetailPage({ params }: Props) {
  const { id } = use(params);
  const tmdbId = Number(id);
  const { movie, loading } = useMovieDetails(tmdbId);
  const { isFavorite, getFavoriteId, add: addFav, remove: removeFav } = useFavorites();
  const { isInWatchlist, add: addWatch } = useWatchlist();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[70vh] w-full rounded-none" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const content: ContentReferencePayload = {
    tmdb_id: movie.id,
    media_type: MediaType.Movie,
    title: movie.title,
    poster_path: movie.poster_path,
  };

  const fid = getFavoriteId(movie.id);

  return (
    <div className="-mx-4 sm:-mx-6 -mt-6">
      <MediaHero
        item={movie}
        mediaType={MediaType.Movie}
        isFavorite={isFavorite(movie.id)}
        isInWatchlist={isInWatchlist(movie.id)}
        onFavorite={() => fid ? removeFav(fid) : addFav(content)}
        onWatchlist={() => addWatch(content)}
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {movie.credits?.cast && <CastSection cast={movie.credits.cast} />}
        <ReviewsSection tmdbId={movie.id} mediaType={MediaType.Movie} content={content} />

        {/* Fórum */}
        <section>
          <SectionHeader
            title="Discussão no Fórum"
            subtitle="Compartilhe sua opinião com a comunidade"
            href={`/forum?tmdb_id=${movie.id}&media_type=movie`}
            action={
              <CreateForumPostModal
                preselectedContent={content}
                onCreated={(c, title, body) =>
                  forumService.createPost({ content_reference_data: c, title, content: body })
                }
              >
                <Button size="sm" variant="outline" className="gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Criar discussão
                </Button>
              </CreateForumPostModal>
            }
          />
        </section>
      </div>
    </div>
  );
}
