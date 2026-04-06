"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MessageSquare, Trash2, User } from "lucide-react";
import { ForumPost } from "@/domain/types/forum.types";
import { buildImageUrl, formatDate } from "@/shared/utils/tmdb.utils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { cn } from "@/lib/utils";

interface ForumPostCardProps {
  post: ForumPost;
  onLike?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function ForumPostCard({ post, onLike, onDelete }: ForumPostCardProps) {
  const currentUser = useSelector((state: RootState) => state.auth.user?.username ?? null);

  return (
    <article className="bg-card border border-border/60 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 group">
      <div className="flex gap-0">
        {/* Poster thumbnail */}
        {post.content_reference?.poster_path && (
          <div className="relative w-20 shrink-0 hidden sm:block">
            <Image
              src={buildImageUrl(post.content_reference.poster_path, "w92")}
              alt={post.content_reference.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80" />
          </div>
        )}

        <div className="flex-1 p-4">
          {/* Content tag */}
          {post.content_reference && (
            <Link
              href={`/${post.content_reference.media_type}/${post.content_reference.tmdb_id}`}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-2"
              onClick={(e) => e.stopPropagation()}
            >
              {post.content_reference.title}
            </Link>
          )}

          <Link href={`/forum/${post.id}`} className="block">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {post.content}
            </p>
          </Link>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>@{post.user_username}</span>
              <span className="mx-1">·</span>
              <span>{formatDate(post.created_at)}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onLike?.(post.id)}
                className={cn(
                  "flex items-center gap-1 text-xs transition-colors",
                  "text-muted-foreground hover:text-red-400"
                )}
              >
                <Heart className="w-3.5 h-3.5" />
                {post.likes_count}
              </button>
              <Link
                href={`/forum/${post.id}`}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {post.comments_count}
              </Link>
              {currentUser === post.user_username && onDelete && (
                <button
                  onClick={() => onDelete(post.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
