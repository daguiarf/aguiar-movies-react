import { favoritesRepository } from "@/infra/repositories/favorites.repository";
import { AddFavoritePayload } from "@/domain/types/favorites.types";

export const favoritesService = {
  list: () => favoritesRepository.list(),
  add: (payload: AddFavoritePayload) => favoritesRepository.add(payload),
  get: (id: number) => favoritesRepository.get(id),
  remove: (id: number) => favoritesRepository.remove(id),
};
