"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/shared/components/StarRating";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { useReviews } from "@/modules/reviews/hooks/useReviews";
import { ContentReferencePayload } from "@/domain/types/content.types";
import { MediaType } from "@/domain/enums/media-type.enum";
import { formatDate } from "@/shared/utils/tmdb.utils";
import { authService } from "@/services/auth.service";

interface ReviewsSectionProps {
  tmdbId: number;
  mediaType: MediaType;
  content: ContentReferencePayload;
}

export function ReviewsSection({ tmdbId, mediaType, content }: ReviewsSectionProps) {
  const { reviews, loading, create, update, remove } = useReviews({ tmdb_id: tmdbId, media_type: mediaType });
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const currentUser = authService.getUsername();

  async function handleSubmit() {
    if (!text.trim()) return;
    if (editId !== null) {
      await update(editId, text, rating);
      setEditId(null);
    } else {
      await create(content, text, rating);
      setShowForm(false);
    }
    setText("");
    setRating(null);
  }

  function startEdit(id: number, currentText: string, currentRating: number | null) {
    setEditId(id);
    setText(currentText);
    setRating(currentRating);
    setShowForm(false);
  }

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Reviews"
        subtitle={`${reviews.length} avaliações`}
        action={
          !showForm && editId === null ? (
            <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowForm(true)}>
              <Plus className="w-3.5 h-3.5" />
              Escrever
            </Button>
          ) : undefined
        }
      />

      {/* Form */}
      {(showForm || editId !== null) && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
          <StarRating value={rating} onChange={setRating} size="lg" />
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva sua review..."
            rows={3}
            className="resize-none"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmit} disabled={!text.trim()}>
              {editId !== null ? "Salvar" : "Publicar"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setEditId(null);
                setText("");
                setRating(null);
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Nenhuma review ainda. Seja o primeiro a avaliar!
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-semibold text-foreground">
                    @{review.user_username}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {review.rating !== null && (
                    <StarRating value={review.rating} readonly size="sm" />
                  )}
                  {currentUser === review.user_username && (
                    <div className="flex gap-1">
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
                  )}
                </div>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
