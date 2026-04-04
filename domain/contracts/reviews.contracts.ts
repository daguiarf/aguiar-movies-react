import {
  CreateReviewPayload,
  DeleteReviewResponse,
  Review,
  ReviewsListParams,
  ReviewsListResponse,
  UpdateReviewPayload,
} from "@/domain/types/reviews.types";

export interface IReviewsRepository {
  list(params?: ReviewsListParams): Promise<ReviewsListResponse>;
  create(payload: CreateReviewPayload): Promise<Review>;
  get(id: number): Promise<Review>;
  update(id: number, payload: UpdateReviewPayload): Promise<Review>;
  remove(id: number): Promise<DeleteReviewResponse>;
}
