"use client";

import { useCallback, useEffect, useState } from "react";
import { forumService } from "@/services/forum.service";
import { ForumComment } from "@/domain/types/forum.types";
import { swalConfirm } from "@/shared/utils/swal";

export function useComments(postId: number) {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);

  const load = useCallback(async (cursor?: number) => {
    setLoading(true);
    try {
      const result = await forumService.listComments(postId, { last_id: cursor });
      if (cursor) {
        setComments((prev) => [...prev, ...result.results]);
      } else {
        setComments(result.results);
      }
      setHasMore(result.has_more);
      setNextCursor(result.next_cursor);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { load(); }, [load]);

  async function loadMore() {
    if (nextCursor) load(nextCursor);
  }

  async function addComment(content: string) {
    const comment = await forumService.createComment(postId, { content });
    setComments((prev) => [...prev, comment]);
    return comment;
  }

  async function deleteComment(id: number) {
    const result = await swalConfirm("Excluir comentário?");
    if (result.isConfirmed) {
      await forumService.deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  }

  return { comments, loading, hasMore, loadMore, addComment, deleteComment };
}
