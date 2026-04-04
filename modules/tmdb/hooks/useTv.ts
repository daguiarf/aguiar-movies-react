"use client";

import { useCallback, useEffect, useState } from "react";
import { TmdbTV } from "@/domain/types/tmdb.types";
import { tmdbService } from "@/services/tmdb.service";

export function usePopularTV() {
  const [items, setItems] = useState<TmdbTV[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const genreParam = selectedGenres.join(",");
  const hasMore = page < totalPages;

  const load = useCallback(async (p: number, reset: boolean) => {
    if (reset) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    try {
      const result = await tmdbService.getPopularTV({ page: p, genres: genreParam || undefined });
      setTotalPages(result.total_pages ?? 1);
      setTotalResults(result.total_results ?? null);
      if (reset) {
        setItems(result.results ?? []);
      } else {
        setItems((prev) => [...prev, ...(result.results ?? [])]);
      }
    } catch {
      setError("Não foi possível carregar as séries.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [genreParam]);

  useEffect(() => {
    setPage(1);
    load(1, true);
  }, [genreParam]);

  function loadMore() {
    if (loadingMore || !hasMore) return;
    const next = page + 1;
    setPage(next);
    load(next, false);
  }

  function toggleGenre(id: number) {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  function clearGenres() {
    setSelectedGenres([]);
  }

  return { items, loading, loadingMore, error, hasMore, totalResults, loadMore, selectedGenres, toggleGenre, clearGenres };
}

export function useTVDetails(tmdbId: number) {
  const [tv, setTV] = useState<TmdbTV | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    tmdbService
      .getTVDetails(tmdbId)
      .then(setTV)
      .catch(() => setError("Não foi possível carregar a série."))
      .finally(() => setLoading(false));
  }, [tmdbId]);

  return { tv, loading, error };
}
