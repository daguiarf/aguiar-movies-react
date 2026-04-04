"use client";

import { useCallback, useEffect, useState } from "react";
import { watchlistService } from "@/services/watchlist.service";
import { WatchlistItem } from "@/domain/types/watchlist.types";
import { ContentReferencePayload } from "@/domain/types/content.types";
import { swal, swalConfirm, swalInfo } from "@/shared/utils/swal";

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { results } = await watchlistService.list();
      setItems(results ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const isInWatchlist = useCallback(
    (tmdbId: number) => items.some((i) => i.content.tmdb_id === tmdbId),
    [items]
  );

  const getWatchlistItem = useCallback(
    (tmdbId: number) => items.find((i) => i.content.tmdb_id === tmdbId),
    [items]
  );

  async function add(content: ContentReferencePayload, watchDate?: string) {
    try {
      const item = await watchlistService.add({ content_data: content, watch_date: watchDate, watched: false });
      setItems((prev) => [...prev, item]);
      await swal({ icon: "success", title: "Adicionado à Watchlist!", timer: 1800, showConfirmButton: false });
    } catch (err: any) {
      if (err.response?.status === 409) {
        await swalInfo("Já na Watchlist", "Este conteúdo já está na sua watchlist.");
      }
    }
  }

  async function markWatched(id: number, watched: boolean) {
    const updated = await watchlistService.update(id, { watched });
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  }

  async function remove(id: number) {
    const result = await swalConfirm("Remover da Watchlist?");
    if (result.isConfirmed) {
      await watchlistService.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  return { items, loading, isInWatchlist, getWatchlistItem, add, markWatched, remove };
}
