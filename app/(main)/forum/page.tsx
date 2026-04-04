"use client";

import { useState } from "react";
import { useForumPosts } from "@/modules/forum/hooks/useForum";
import { ForumPostCard } from "@/modules/forum/components/ForumPostCard";
import { CreateForumPostModal } from "@/modules/forum/components/CreateForumPostModal";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentReferencePayload } from "@/domain/types/content.types";

export default function ForumPage() {
  const { posts, loading, hasMore, loadMore, createPost, deletePost, toggleLike } = useForumPosts();

  async function handleCreate(content: ContentReferencePayload, title: string, body: string) {
    await createPost(content, title, body);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8 gap-4">
        <PageHeader title="Fórum" description="Discussões da comunidade sobre filmes e séries" />
        <CreateForumPostModal onCreated={handleCreate} />
      </div>

      {loading && posts.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <MessageSquare className="w-16 h-16 text-muted-foreground/30" />
          <div>
            <p className="text-lg font-semibold">Nenhum post ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Seja o primeiro a iniciar uma discussão
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <ForumPostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onDelete={deletePost}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-current/30 border-t-current rounded-full" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Carregar mais
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
