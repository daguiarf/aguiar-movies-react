"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { forumService } from "@/services/forum.service";
import { ForumPost } from "@/domain/types/forum.types";
import { useComments } from "@/modules/forum/hooks/useComments";
import { formatDate } from "@/shared/utils/tmdb.utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageSquare, ChevronLeft, Trash2, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { swalConfirm } from "@/shared/utils/swal";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ForumPostDetailPage({ params }: Props) {
  const { id } = use(params);
  const postId = Number(id);
  const router = useRouter();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const { comments, loading: commentsLoading, hasMore, loadMore, addComment, deleteComment } =
    useComments(postId);
  const currentUser = useSelector((state: RootState) => state.auth.user?.username ?? null);

  useEffect(() => {
    forumService.getPost(postId).then(setPost).finally(() => setLoading(false));
  }, [postId]);

  async function handleLike() {
    if (!post) return;
    const { likes_count } = await forumService.likePost(post.id);
    setPost((p) => p ? { ...p, likes_count } : p);
  }

  async function handleDeletePost() {
    if (!post) return;
    const result = await swalConfirm("Excluir post?");
    if (result.isConfirmed) {
      await forumService.deletePost(post.id);
      router.replace("/forum");
    }
  }

  async function handleComment() {
    if (!newComment.trim()) return;
    await addComment(newComment.trim());
    setNewComment("");
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar ao fórum
      </button>

      {/* Post */}
      <article className="bg-card border border-border rounded-xl p-6 space-y-4">
        {post.content_reference && (
          <Link
            href={`/${post.content_reference.media_type}/${post.content_reference.tmdb_id}`}
            className="text-xs text-primary hover:underline"
          >
            {post.content_reference.title}
          </Link>
        )}
        <h1 className="text-2xl font-bold leading-tight">{post.title}</h1>
        <div className="text-xs text-muted-foreground">
          @{post.user_username} · {formatDate(post.created_at)}
        </div>
        <p className="text-sm sm:text-base text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-400 transition-colors"
            >
              <Heart className="w-4 h-4" />
              {post.likes_count}
            </button>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              {comments.length}
            </span>
          </div>
          {currentUser === post.user_username && (
            <button
              onClick={handleDeletePost}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Excluir post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </article>

      {/* Comments */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Comentários</h2>

        {/* New comment */}
        <div className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={3}
            className="resize-none"
          />
          <Button
            size="sm"
            onClick={handleComment}
            disabled={!newComment.trim()}
            className="gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Comentar
          </Button>
        </div>

        {/* Comments list */}
        {commentsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum comentário ainda. Seja o primeiro!
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-card border border-border/60 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">@{comment.user_username}</span>
                    <span className="mx-1">·</span>
                    {formatDate(comment.created_at)}
                  </div>
                  {currentUser === comment.user_username && (
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-foreground/90 mt-2 leading-relaxed">{comment.content}</p>
              </div>
            ))}

            {hasMore && (
              <div className="flex justify-center">
                <Button variant="ghost" size="sm" onClick={loadMore} className="gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  Carregar mais
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
