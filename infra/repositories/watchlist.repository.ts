import api from "@/infra/http/api";
import { unwrap } from "@/infra/http/unwrap";
import { IWatchlistRepository } from "@/domain/contracts/watchlist.contracts";
import {
  AddWatchlistPayload,
  RemoveWatchlistResponse,
  UpdateWatchlistPayload,
  WatchlistItem,
  WatchlistListResponse,
} from "@/domain/types/watchlist.types";

export class WatchlistRepository implements IWatchlistRepository {
  async list(): Promise<WatchlistListResponse> {
    const { data } = await api.get("/api/watchlist/");
    return unwrap<WatchlistListResponse>(data);
  }

  async add(payload: AddWatchlistPayload): Promise<WatchlistItem> {
    const { data } = await api.post("/api/watchlist/", payload);
    return unwrap<WatchlistItem>(data);
  }

  async get(id: number): Promise<WatchlistItem> {
    const { data } = await api.get(`/api/watchlist/${id}/`);
    return unwrap<WatchlistItem>(data);
  }

  async update(id: number, payload: UpdateWatchlistPayload): Promise<WatchlistItem> {
    const { data } = await api.patch(`/api/watchlist/${id}/`, payload);
    return unwrap<WatchlistItem>(data);
  }

  async remove(id: number): Promise<RemoveWatchlistResponse> {
    const { data } = await api.delete(`/api/watchlist/${id}/`);
    return unwrap<RemoveWatchlistResponse>(data);
  }
}

export const watchlistRepository = new WatchlistRepository();
