import { ContentReference, ContentReferencePayload } from "@/domain/types/content.types";

export interface Favorite {
  id: number;
  content: ContentReference;
  created_at: string;
}

export interface FavoritesListResponse {
  results: Favorite[];
}

export interface AddFavoritePayload {
  content_data: ContentReferencePayload;
}

export interface RemoveFavoriteResponse {
  success: boolean;
  message: string;
}
