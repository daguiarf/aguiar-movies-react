import { forumRepository } from "@/infra/repositories/forum.repository";
import {
  CreateCommentPayload,
  CreateForumPostPayload,
  ForumCommentsParams,
  ForumPostsParams,
  UpdateCommentPayload,
  UpdateForumPostPayload,
} from "@/domain/types/forum.types";

export const forumService = {
  listPosts: (params?: ForumPostsParams) => forumRepository.listPosts(params),
  createPost: (payload: CreateForumPostPayload) => forumRepository.createPost(payload),
  getPost: (id: number) => forumRepository.getPost(id),
  updatePost: (id: number, payload: UpdateForumPostPayload) => forumRepository.updatePost(id, payload),
  deletePost: (id: number) => forumRepository.deletePost(id),
  likePost: (id: number) => forumRepository.likePost(id),
  listComments: (postId: number, params?: ForumCommentsParams) =>
    forumRepository.listComments(postId, params),
  createComment: (postId: number, payload: CreateCommentPayload) =>
    forumRepository.createComment(postId, payload),
  updateComment: (id: number, payload: UpdateCommentPayload) =>
    forumRepository.updateComment(id, payload),
  deleteComment: (id: number) => forumRepository.deleteComment(id),
};
