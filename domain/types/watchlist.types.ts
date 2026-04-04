import { ContentReference, ContentReferencePayload } from "@/domain/types/content.types";

export interface WatchlistItem {
  id: number;
  content: ContentReference;
  watch_date: string | null;
  watched: boolean;
  created_at: string;
  updated_at: string;
}

export interface WatchlistListResponse {
  results: WatchlistItem[];
}

export interface AddWatchlistPayload {
  content_data: ContentReferencePayload;
  watch_date?: string;
  watched?: boolean;
}

export interface UpdateWatchlistPayload {
  watch_date?: string;
  watched?: boolean;
}

export interface RemoveWatchlistResponse {
  success: boolean;
  message: string;
}
