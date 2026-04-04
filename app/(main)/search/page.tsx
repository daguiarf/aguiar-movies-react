"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/modules/tmdb/hooks/useSearch";
import { MediaGrid } from "@/shared/components/MediaGrid";
import { PageHeader } from "@/shared/components/PageHeader";
import { MediaType } from "@/domain/enums/media-type.enum";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const { data, loading, query, page, search, setPage } = useSearch();

  useEffect(() => {
    if (q) search(q);
  }, [q]);

  const filtered = (data?.results ?? [])
    .filter((r) => r.media_type === MediaType.Movie || r.media_type === MediaType.TV)
    .map((r) => ({ ...r, poster_path: (r as { poster_path?: string | null }).poster_path ?? null }));

  return (
    <div>
      <PageHeader
        title={query ? `Resultados para "${query}"` : "Busca"}
        description={data ? `${data.total_results} resultados encontrados` : undefined}
      />

      {!loading && !filtered.length && query && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <SearchX className="w-16 h-16 text-muted-foreground/40" />
          <div>
            <p className="text-lg font-semibold">Nenhum resultado encontrado</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tente buscar por outro título
            </p>
          </div>
        </div>
      )}

      <MediaGrid
        items={filtered}
        loading={loading}
        mediaType={MediaType.Movie}
      />

      {data && data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => { setPage(page - 1); search(query, page - 1); }}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">{page} / {data.total_pages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.total_pages}
            onClick={() => { setPage(page + 1); search(query, page + 1); }}
            className="gap-1"
          >
            Próxima <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
