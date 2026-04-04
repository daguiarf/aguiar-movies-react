"use client";

import { useCallback, useState } from "react";
import { tmdbService } from "@/services/tmdb.service";
import { TmdbPaginatedResponse, TmdbSearchResult } from "@/domain/types/tmdb.types";

export function useSearch() {
  const [data, setData] = useState<TmdbPaginatedResponse<TmdbSearchResult> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const search = useCallback(async (q: string, p = 1) => {
    if (!q.trim()) {
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    setQuery(q);
    setPage(p);
    try {
      const result = await tmdbService.search({ query: q, page: p });
      setData(result);
    } catch {
      setError("Não foi possível buscar.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, query, page, search, setPage };
}
