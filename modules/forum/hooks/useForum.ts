"use client";

import { useCallback, useEffect, useState } from "react";
import { forumService } from "@/services/forum.service";
import { ForumPost, ForumPostsParams } from "@/domain/types/forum.types";
import { ContentReferencePayload } from "@/domain/types/content.types";
import { swalConfirm } from "@/shared/utils/swal";

export function useForumPosts(params?: ForumPostsParams) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  const load = useCallback(async (cursor?: number) => {
    setLoading(true);
    try {
      const result = await forumService.listPosts({ ...params, last_id: cursor });
      if (cursor) {
        setPosts((prev) => [...prev, ...result.results]);
      } else {
        setPosts(result.results);
      }
      setHasMore(result.has_more);
      setNextCursor(result.next_cursor);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { load(); }, [load]);

  async function loadMore() {
    if (nextCursor) load(nextCursor);
  }

  async function createPost(content: ContentReferencePayload, title: string, postContent: string) {
    const post = await forumService.createPost({
      content_reference_data: content,
      title,
      content: postContent,
    });
    setPosts((prev) => [post, ...prev]);
    return post;
  }

  async function deletePost(id: number) {
    const result = await swalConfirm("Excluir post?", "Esta ação não pode ser desfeita.");
    if (result.isConfirmed) {
      await forumService.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  async function toggleLike(id: number) {
    const { likes_count } = await forumService.likePost(id);
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes_count } : p)));
  }

  return { posts, loading, hasMore, loadMore, createPost, deletePost, toggleLike };
}
