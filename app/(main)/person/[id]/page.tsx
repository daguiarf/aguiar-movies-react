"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePersonDetails } from "@/modules/tmdb/hooks/usePerson";
import { buildImageUrl, formatDate } from "@/shared/utils/tmdb.utils";
import { calculateAge } from "@/shared/utils/date.utils";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { HorizontalCarousel } from "@/modules/tmdb/components/HorizontalCarousel";

interface Props {
  params: Promise<{ id: string }>;
}

export default function PersonDetailPage({ params }: Props) {
  const { id } = use(params);
  const { person, loading } = usePersonDetails(Number(id));
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-8 w-1/4" />
      </div>
    );
  }

  if (!person) return null;

  const movieCast = person.movie_credits?.cast ?? [];
  const tvCast = person.tv_credits?.cast ?? [];

  const age = person.birthday
    ? calculateAge(person.birthday, person.deathday)
    : null;

  return (
    <div className="space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="relative w-48 h-72 shrink-0 rounded-xl overflow-hidden shadow-xl self-center sm:self-start">
          <Image
            src={buildImageUrl(person.profile_path, "w342")}
            alt={person.name}
            fill
            className="object-cover object-top"
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold">{person.name}</h1>

          <p className="text-muted-foreground text-sm">
            {person.known_for_department}
          </p>

          {age !== null && (
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                {age} anos
              </span>

              {person.birthday && (
                <span className="text-sm text-muted-foreground">
                  {formatDate(person.birthday)}
                </span>
              )}
            </div>
          )}

          {person.place_of_birth && (
            <p className="text-sm text-muted-foreground">
              {person.place_of_birth}
            </p>
          )}

          {person.biography && (
            <p className="text-sm text-muted-foreground/90 leading-relaxed max-w-2xl line-clamp-6">
              {person.biography}
            </p>
          )}
        </div>
      </div>

      {movieCast.length > 0 && (
        <section>
          <SectionHeader title="Filmes" />

          <HorizontalCarousel>
            {movieCast.map((m) => (
              <Link
                key={m.id}
                href={`/movies/${m.id}`}
                className="shrink-0 w-24 group"
              >
                <div className="relative w-24 h-36 rounded-xl overflow-hidden bg-muted border border-border/50 mb-2 group-hover:border-primary/50 transition-colors">
                  <Image
                    src={buildImageUrl(m.poster_path, "w185")}
                    alt={m.title ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs font-medium line-clamp-1">
                  {m.title}
                </p>
              </Link>
            ))}
          </HorizontalCarousel>
        </section>
      )}

      {tvCast.length > 0 && (
        <section>
          <SectionHeader title="Séries" />

          <HorizontalCarousel>
            {tvCast.map((t) => (
              <Link
                key={t.id}
                href={`/tv/${t.id}`}
                className="shrink-0 w-24 group"
              >
                <div className="relative w-24 h-36 rounded-xl overflow-hidden bg-muted border border-border/50 mb-2 group-hover:border-primary/50 transition-colors">
                  <Image
                    src={buildImageUrl(t.poster_path, "w185")}
                    alt={t.name ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs font-medium line-clamp-1">
                  {t.name}
                </p>
              </Link>
            ))}
          </HorizontalCarousel>
        </section>
      )}
    </div>
  );
}