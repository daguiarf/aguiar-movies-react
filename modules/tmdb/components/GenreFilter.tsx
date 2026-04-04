"use client";

import { Button } from "@/components/ui/button";
import { useGenres } from "../hooks/useGenres";

interface Props {
  selected: number[];
  onToggle: (id: number) => void;
  onClear: () => void;
  type?: "movie" | "tv";
}

export function GenreFilter({ selected, onToggle, onClear, type = "movie" }: Props) {
  const { genres, loading } = useGenres(type);

  if (loading) return null;

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {genres.map((genre) => {
          const active = selected.includes(genre.id);

          return (
            <Button
              key={genre.id}
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => onToggle(genre.id)}
              className="whitespace-nowrap rounded-full"
            >
              {genre.name}
            </Button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Limpar filtros
        </Button>
      )}
    </div>
  );
}