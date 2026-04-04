import api from "@/infra/http/api";
import { unwrap } from "@/infra/http/unwrap";
import { IForumRepository } from "@/domain/contracts/forum.contracts";
import {
  CreateCommentPayload,
  CreateForumPostPayload,
  CursorPaginatedResponse,
  DeleteResponse,
  ForumComment,
  ForumPost,
  ForumCommentsParams,
  ForumPostsParams,
  LikeResponse,
  UpdateCommentPayload,
  UpdateForumPostPayload,
} from "@/domain/types/forum.types";

export class ForumRepository implements IForumRepository {
  async listPosts(params?: ForumPostsParams): Promise<CursorPaginatedResponse<ForumPost>> {
    const { data } = await api.get("/api/forum/posts/", { params });
    return unwrap<CursorPaginatedResponse<ForumPost>>(data);
  }

  async createPost(payload: CreateForumPostPayload): Promise<ForumPost> {
    const { data } = await api.post("/api/forum/posts/", payload);
    return unwrap<ForumPost>(data);
  }

  async getPost(id: number): Promise<ForumPost> {
    const { data } = await api.get(`/api/forum/posts/${id}/`);
    return unwrap<ForumPost>(data);
  }

  async updatePost(id: number, payload: UpdateForumPostPayload): Promise<ForumPost> {
    const { data } = await api.patch(`/api/forum/posts/${id}/`, payload);
    return unwrap<ForumPost>(data);
  }

  async deletePost(id: number): Promise<DeleteResponse> {
    const { data } = await api.delete(`/api/forum/posts/${id}/`);
    return unwrap<DeleteResponse>(data);
  }

  async likePost(id: number): Promise<LikeResponse> {
    const { data } = await api.post(`/api/forum/posts/${id}/like/`);
    return unwrap<LikeResponse>(data);
  }

  async listComments(postId: number, params?: ForumCommentsParams): Promise<CursorPaginatedResponse<ForumComment>> {
    const { data } = await api.get(`/api/forum/posts/${postId}/comments/`, { params });
    return unwrap<CursorPaginatedResponse<ForumComment>>(data);
  }

  async createComment(postId: number, payload: CreateCommentPayload): Promise<ForumComment> {
    const { data } = await api.post(`/api/forum/posts/${postId}/comments/create/`, payload);
    return unwrap<ForumComment>(data);
  }

  async updateComment(id: number, payload: UpdateCommentPayload): Promise<ForumComment> {
    const { data } = await api.patch(`/api/forum/comments/${id}/`, payload);
    return unwrap<ForumComment>(data);
  }

  async deleteComment(id: number): Promise<DeleteResponse> {
    const { data } = await api.delete(`/api/forum/comments/${id}/`);
    return unwrap<DeleteResponse>(data);
  }
}

export const forumRepository = new ForumRepository();
