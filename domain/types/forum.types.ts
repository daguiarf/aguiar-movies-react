import { ContentReference, ContentReferencePayload } from "@/domain/types/content.types";
import { MediaType } from "@/domain/enums/media-type.enum";

export interface ForumPost {
  id: number;
  user_username: string;
  content_reference: ContentReference;
  title: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumComment {
  id: number;
  user_username: string;
  content: string;
  created_at: string;
}

export interface CursorPaginatedResponse<T> {
  results: T[];
  next_cursor: number | null;
  has_more: boolean;
}

export interface ForumPostsParams {
  tmdb_id?: number;
  media_type?: MediaType;
  limit?: number;
  last_id?: number;
}

export interface ForumCommentsParams {
  limit?: number;
  last_id?: number;
}

export interface CreateForumPostPayload {
  content_reference_data: ContentReferencePayload;
  title: string;
  content: string;
}

export interface UpdateForumPostPayload {
  title?: string;
  content?: string;
}

export interface CreateCommentPayload {
  content: string;
}

export interface UpdateCommentPayload {
  content: string;
}

export interface LikeResponse {
  likes_count: number;
}

export interface DeleteResponse {
  success: boolean;
}
