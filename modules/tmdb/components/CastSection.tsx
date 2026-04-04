import Image from "next/image";
import Link from "next/link";
import { TmdbCastMember } from "@/domain/types/tmdb.types";
import { buildImageUrl } from "@/shared/utils/tmdb.utils";
import { SectionHeader } from "@/shared/components/SectionHeader";

interface CastSectionProps {
  cast: TmdbCastMember[];
}

export function CastSection({ cast }: CastSectionProps) {
  const visible = cast.slice(0, 12);

  if (!visible.length) return null;

  return (
    <section>
      <SectionHeader title="Elenco" />
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {visible.map((member) => (
          <Link
            key={member.id}
            href={`/person/${member.id}`}
            className="shrink-0 w-24 group"
          >
            <div className="relative w-24 h-32 rounded-xl overflow-hidden bg-muted border border-border/50 mb-2 group-hover:border-primary/50 transition-colors">
              <Image
                src={buildImageUrl(member.profile_path, "w185")}
                alt={member.name}
                fill
                className="object-cover object-top"
              />
            </div>
            <p className="text-xs font-medium text-foreground line-clamp-1 leading-tight">
              {member.name}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {member.character}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
