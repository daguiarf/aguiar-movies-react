import { watchlistRepository } from "@/infra/repositories/watchlist.repository";
import { AddWatchlistPayload, UpdateWatchlistPayload } from "@/domain/types/watchlist.types";

export const watchlistService = {
  list: () => watchlistRepository.list(),
  add: (payload: AddWatchlistPayload) => watchlistRepository.add(payload),
  get: (id: number) => watchlistRepository.get(id),
  update: (id: number, payload: UpdateWatchlistPayload) => watchlistRepository.update(id, payload),
  remove: (id: number) => watchlistRepository.remove(id),
};
