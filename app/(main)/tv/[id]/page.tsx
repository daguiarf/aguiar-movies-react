"use client";

import { use } from "react";
import { useTVDetails } from "@/modules/tmdb/hooks/useTv";
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

export default function TVDetailPage({ params }: Props) {
  const { id } = use(params);
  const tmdbId = Number(id);
  const { tv, loading } = useTVDetails(tmdbId);
  const { isFavorite, getFavoriteId, add: addFav, remove: removeFav } = useFavorites();
  const { isInWatchlist, add: addWatch } = useWatchlist();

  if (loading) {
    return <Skeleton className="h-[70vh] w-full rounded-none" />;
  }

  if (!tv) return null;

  const content: ContentReferencePayload = {
    tmdb_id: tv.id,
    media_type: MediaType.TV,
    title: tv.name,
    poster_path: tv.poster_path,
  };

  const fid = getFavoriteId(tv.id);

  return (
    <div className="-mx-4 sm:-mx-6 -mt-6">
      <MediaHero
        item={tv}
        mediaType={MediaType.TV}
        isFavorite={isFavorite(tv.id)}
        isInWatchlist={isInWatchlist(tv.id)}
        onFavorite={() => fid ? removeFav(fid) : addFav(content)}
        onWatchlist={() => addWatch(content)}
      />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {tv.credits?.cast && <CastSection cast={tv.credits.cast} />}
        <ReviewsSection tmdbId={tv.id} mediaType={MediaType.TV} content={content} />

        {/* Fórum */}
        <section>
          <SectionHeader
            title="Discussão no Fórum"
            subtitle="Compartilhe sua opinião com a comunidade"
            href={`/forum?tmdb_id=${tv.id}&media_type=tv`}
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
