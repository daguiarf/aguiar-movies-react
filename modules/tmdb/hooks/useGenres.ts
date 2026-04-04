"use client";

import { useEffect, useState } from "react";
import { TmdbGenre } from "@/domain/types/tmdb.types";
import { tmdbService } from "@/services/tmdb.service";

export function useGenres(type: "movie" | "tv" = "movie") {
  const [genres, setGenres] = useState<TmdbGenre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tmdbService
      .getGenres(type)
      .then((res) => setGenres(res.genres))
      .finally(() => setLoading(false));
  }, [type]);

  return { genres, loading };
}