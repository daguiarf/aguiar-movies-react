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

export interface IForumRepository {
  listPosts(params?: ForumPostsParams): Promise<CursorPaginatedResponse<ForumPost>>;
  createPost(payload: CreateForumPostPayload): Promise<ForumPost>;
  getPost(id: number): Promise<ForumPost>;
  updatePost(id: number, payload: UpdateForumPostPayload): Promise<ForumPost>;
  deletePost(id: number): Promise<DeleteResponse>;
  likePost(id: number): Promise<LikeResponse>;
  listComments(postId: number, params?: ForumCommentsParams): Promise<CursorPaginatedResponse<ForumComment>>;
  createComment(postId: number, payload: CreateCommentPayload): Promise<ForumComment>;
  updateComment(id: number, payload: UpdateCommentPayload): Promise<ForumComment>;
  deleteComment(id: number): Promise<DeleteResponse>;
}
