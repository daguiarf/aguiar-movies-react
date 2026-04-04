"use client";

import { useCallback, useEffect, useState } from "react";
import { favoritesService } from "@/services/favorites.service";
import { Favorite } from "@/domain/types/favorites.types";
import { ContentReferencePayload } from "@/domain/types/content.types";
import { swal, swalConfirm, swalInfo } from "@/shared/utils/swal";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { results } = await favoritesService.list();
      setFavorites(results ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const isFavorite = useCallback(
    (tmdbId: number) => favorites.some((f) => f.content.tmdb_id === tmdbId),
    [favorites]
  );

  const getFavoriteId = useCallback(
    (tmdbId: number) => favorites.find((f) => f.content.tmdb_id === tmdbId)?.id,
    [favorites]
  );

  async function add(content: ContentReferencePayload) {
    try {
      const fav = await favoritesService.add({ content_data: content });
      setFavorites((prev) => [...prev, fav]);
      await swal({ icon: "success", title: "Favoritado!", text: `${content.title} adicionado aos favoritos.`, timer: 1800, showConfirmButton: false });
    } catch (err: any) {
      if (err.response?.status === 409) {
        await swalInfo("Já favoritado", "Este conteúdo já está nos seus favoritos.");
      }
    }
  }

  async function remove(id: number) {
    const result = await swalConfirm("Remover favorito?", "Tem certeza que deseja remover dos favoritos?");
    if (result.isConfirmed) {
      await favoritesService.remove(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    }
  }

  return { favorites, loading, isFavorite, getFavoriteId, add, remove };
}
