"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, X, Film, Tv } from "lucide-react";
import { useSearch } from "@/modules/tmdb/hooks/useSearch";
import { buildImageUrl } from "@/shared/utils/tmdb.utils";
import { MediaType } from "@/domain/enums/media-type.enum";
import { ContentReferencePayload } from "@/domain/types/content.types";
import { TmdbMovie, TmdbTV } from "@/domain/types/tmdb.types";
import { swal, swalError } from "@/shared/utils/swal";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CreateForumPostModalProps {
  onCreated: (content: ContentReferencePayload, title: string, body: string) => Promise<unknown>;
  preselectedContent?: ContentReferencePayload;
  children?: React.ReactNode;
}

export function CreateForumPostModal({
  onCreated,
  preselectedContent,
  children,
}: CreateForumPostModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"search" | "write">(preselectedContent ? "write" : "search");
  const [selectedContent, setSelectedContent] = useState<ContentReferencePayload | null>(
    preselectedContent ?? null
  );
  const [searchInput, setSearchInput] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data, loading, search } = useSearch();

  const handleSearch = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (value.trim().length >= 2) search(value);
    },
    [search]
  );

  function selectContent(item: TmdbMovie | TmdbTV, mediaType: MediaType) {
    const content: ContentReferencePayload = {
      tmdb_id: item.id,
      media_type: mediaType,
      title: (item as TmdbMovie).title ?? (item as TmdbTV).name,
      poster_path: item.poster_path,
    };
    setSelectedContent(content);
    setStep("write");
  }

  async function handleSubmit() {
    if (!selectedContent || !title.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      await onCreated(selectedContent, title.trim(), body.trim());
      handleClose();
      // Sempre exibe o aviso de sucesso após fechar o modal
      await swal({
        icon: "success",
        title: "Post publicado!",
        text: "Sua discussão foi criada com sucesso.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Não foi possível criar o post.";
      await swalError("Erro ao publicar", msg);
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setStep(preselectedContent ? "write" : "search");
      setSelectedContent(preselectedContent ?? null);
      setSearchInput("");
      setTitle("");
      setBody("");
    }, 300);
  }

  const searchResults = (data?.results ?? []).filter(
    (r) => r.media_type === MediaType.Movie || r.media_type === MediaType.TV
  ) as (TmdbMovie | TmdbTV)[];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else setOpen(true); }}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Post
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            {step === "search" ? "Escolha um filme ou série" : "Criar post no fórum"}
          </DialogTitle>
        </DialogHeader>

        {step === "search" ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                autoFocus
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar filme ou série..."
                className="pl-9"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
              {loading && (
                <div className="flex justify-center py-6">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              )}
              {!loading && searchResults.length === 0 && searchInput.length >= 2 && (
                <p className="text-sm text-muted-foreground text-center py-6">Nenhum resultado encontrado.</p>
              )}
              {searchResults.map((item) => {
                const isMovie = item.media_type === MediaType.Movie;
                const t = (item as TmdbMovie).title ?? (item as TmdbTV).name;
                const date = (item as TmdbMovie).release_date ?? (item as TmdbTV).first_air_date;
                const year = date ? new Date(date).getFullYear() : null;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectContent(item, item.media_type as MediaType)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 bg-muted">
                      <Image src={buildImageUrl(item.poster_path, "w92")} alt={t} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{t}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {isMovie ? <Film className="w-3 h-3 text-muted-foreground" /> : <Tv className="w-3 h-3 text-muted-foreground" />}
                        <span className="text-xs text-muted-foreground">
                          {isMovie ? "Filme" : "Série"}{year ? ` · ${year}` : ""}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedContent && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border/60">
                <div className="relative w-10 h-14 rounded overflow-hidden shrink-0">
                  <Image src={buildImageUrl(selectedContent.poster_path, "w92")} alt={selectedContent.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedContent.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {selectedContent.media_type === MediaType.Movie ? "Filme" : "Série"}
                  </p>
                </div>
                {!preselectedContent && (
                  <button onClick={() => setStep("search")} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Título do post</Label>
              <Input
                autoFocus={step === "write"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Qual foi a cena mais marcante?"
                maxLength={120}
              />
              <p className="text-xs text-muted-foreground text-right">{title.length}/120</p>
            </div>

            <div className="space-y-1.5">
              <Label>Conteúdo</Label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Compartilhe seus pensamentos com a comunidade..."
                rows={5}
                className="resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <Button variant="ghost" onClick={handleClose} disabled={submitting}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={!title.trim() || !body.trim() || submitting} className="gap-2">
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Publicar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
