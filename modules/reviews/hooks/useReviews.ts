"use client";

import { useCallback, useEffect, useState } from "react";
import { reviewsService } from "@/services/reviews.service";
import { Review, ReviewsListParams } from "@/domain/types/reviews.types";
import { ContentReferencePayload } from "@/domain/types/content.types";
import { swal, swalConfirm, swalInfo } from "@/shared/utils/swal";

export function useReviews(params?: ReviewsListParams) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { results } = await reviewsService.list(params);
      setReviews(results ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { load(); }, [load]);

  async function create(content: ContentReferencePayload, text: string, rating?: number | null) {
    try {
      const review = await reviewsService.create({ content_data: content, text, rating: rating ?? null });
      setReviews((prev) => [review, ...prev]);
      await swal({ icon: "success", title: "Review publicada!", timer: 1800, showConfirmButton: false });
      return review;
    } catch (err: any) {
      if (err.response?.status === 409) {
        await swalInfo("Review duplicada", "Você já avaliou este conteúdo.");
      }
      return null;
    }
  }

  async function update(id: number, text: string, rating?: number | null) {
    const updated = await reviewsService.update(id, { text, rating });
    setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  }

  async function remove(id: number) {
    const result = await swalConfirm("Excluir review?", "Esta ação não pode ser desfeita.");
    if (result.isConfirmed) {
      await reviewsService.remove(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  }

  return { reviews, loading, create, update, remove, reload: load };
}
