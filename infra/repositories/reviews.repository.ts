import api from "@/infra/http/api";
import { unwrap } from "@/infra/http/unwrap";
import { IReviewsRepository } from "@/domain/contracts/reviews.contracts";
import {
  CreateReviewPayload,
  DeleteReviewResponse,
  Review,
  ReviewsListParams,
  ReviewsListResponse,
  UpdateReviewPayload,
} from "@/domain/types/reviews.types";

export class ReviewsRepository implements IReviewsRepository {
  async list(params?: ReviewsListParams): Promise<ReviewsListResponse> {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params?.tmdb_id) queryParams.tmdb_id = params.tmdb_id;
    if (params?.media_type) queryParams.media_type = params.media_type;
    if (params?.mine) queryParams.mine = "true";

    const { data } = await api.get("/api/reviews/", { params: queryParams });
    return unwrap<ReviewsListResponse>(data);
  }

  async create(payload: CreateReviewPayload): Promise<Review> {
    const { data } = await api.post("/api/reviews/", payload);
    return unwrap<Review>(data);
  }

  async get(id: number): Promise<Review> {
    const { data } = await api.get(`/api/reviews/${id}/`);
    return unwrap<Review>(data);
  }

  async update(id: number, payload: UpdateReviewPayload): Promise<Review> {
    const { data } = await api.patch(`/api/reviews/${id}/`, payload);
    return unwrap<Review>(data);
  }

  async remove(id: number): Promise<DeleteReviewResponse> {
    const { data } = await api.delete(`/api/reviews/${id}/`);
    return unwrap<DeleteReviewResponse>(data);
  }
}

export const reviewsRepository = new ReviewsRepository();
