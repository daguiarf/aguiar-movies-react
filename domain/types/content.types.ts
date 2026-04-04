import { MediaType } from "@/domain/enums/media-type.enum";

export interface ContentReference {
  id?: number;
  tmdb_id: number;
  media_type: MediaType;
  title: string;
  poster_path: string | null;
}

export interface ContentReferencePayload {
  tmdb_id: number;
  media_type: MediaType;
  title: string;
  poster_path: string | null;
}
