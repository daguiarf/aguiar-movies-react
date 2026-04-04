"use client";

import { useReviews } from "@/modules/reviews/hooks/useReviews";
import { PageHeader } from "@/shared/components/PageHeader";
import { StarRating } from "@/shared/components/StarRating";
import { formatDate } from "@/shared/utils/tmdb.utils";
import { Star, Trash2, Pencil } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ReviewsPage() {
  const { reviews, loading, update, remove } = useReviews({ mine: true });
  const [editId, setEditId] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  function startEdit(id: number, currentText: string, currentRating: number | null) {
    setEditId(id);
    setText(currentText);
    setRating(currentRating);
  }

  async function saveEdit() {
    if (editId === null) return;
    await update(editId, text, rating);
    setEditId(null);
  }

  return (
    <div>
      <PageHeader
        title="Minhas Reviews"
        description={reviews.length > 0 ? `${reviews.length} reviews publicadas` : undefined}
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <Star className="w-16 h-16 text-muted-foreground/30" />
          <div>
            <p className="text-lg font-semibold">Nenhuma review ainda</p>
            <p className="text-sm text-muted-foreground mt-1">
              Acesse um filme ou série e escreva sua primeira review
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/${review.content.media_type}/${review.content.tmdb_id}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {review.content.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(review.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {review.rating !== null && <StarRating value={review.rating} readonly size="sm" />}
                  <button
                    onClick={() => startEdit(review.id, review.text, review.rating)}
                    className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => remove(review.id)}
                    className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {editId === review.id ? (
                <div className="space-y-2">
                  <StarRating value={rating} onChange={setRating} size="md" />
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit} disabled={!text.trim()}>Salvar</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground/90 leading-relaxed">{review.text}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
