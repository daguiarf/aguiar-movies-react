"use client";

import { useEffect, useState } from "react";
import { tmdbService } from "@/services/tmdb.service";
import { TmdbPerson } from "@/domain/types/tmdb.types";

export function usePersonDetails(tmdbId: number) {
  const [person, setPerson] = useState<TmdbPerson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    tmdbService
      .getPersonDetails(tmdbId)
      .then(setPerson)
      .catch(() => setError("Não foi possível carregar o perfil."))
      .finally(() => setLoading(false));
  }, [tmdbId]);

  return { person, loading, error };
}
