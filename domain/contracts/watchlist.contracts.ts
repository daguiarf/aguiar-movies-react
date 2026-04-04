import {
  AddWatchlistPayload,
  RemoveWatchlistResponse,
  UpdateWatchlistPayload,
  WatchlistItem,
  WatchlistListResponse,
} from "@/domain/types/watchlist.types";

export interface IWatchlistRepository {
  list(): Promise<WatchlistListResponse>;
  add(payload: AddWatchlistPayload): Promise<WatchlistItem>;
  get(id: number): Promise<WatchlistItem>;
  update(id: number, payload: UpdateWatchlistPayload): Promise<WatchlistItem>;
  remove(id: number): Promise<RemoveWatchlistResponse>;
}
