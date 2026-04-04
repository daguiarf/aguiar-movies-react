import { reviewsRepository } from "@/infra/repositories/reviews.repository";
import { CreateReviewPayload, ReviewsListParams, UpdateReviewPayload } from "@/domain/types/reviews.types";

export const reviewsService = {
  list: (params?: ReviewsListParams) => reviewsRepository.list(params),
  create: (payload: CreateReviewPayload) => reviewsRepository.create(payload),
  get: (id: number) => reviewsRepository.get(id),
  update: (id: number, payload: UpdateReviewPayload) => reviewsRepository.update(id, payload),
  remove: (id: number) => reviewsRepository.remove(id),
};
