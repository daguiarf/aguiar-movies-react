import { ContentReference, ContentReferencePayload } from "@/domain/types/content.types";
import { MediaType } from "@/domain/enums/media-type.enum";

export interface Review {
  id: number;
  user_username: string;
  content: ContentReference;
  text: string;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface ReviewsListResponse {
  results: Review[];
}

export interface ReviewsListParams {
  tmdb_id?: number;
  media_type?: MediaType;
  mine?: boolean;
}

export interface CreateReviewPayload {
  content_data: ContentReferencePayload;
  text: string;
  rating?: number | null;
}

export interface UpdateReviewPayload {
  text?: string;
  rating?: number | null;
}

export interface DeleteReviewResponse {
  success: boolean;
}
