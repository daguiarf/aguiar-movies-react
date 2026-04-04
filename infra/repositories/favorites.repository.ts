import api from "@/infra/http/api";
import { unwrap } from "@/infra/http/unwrap";
import { IFavoritesRepository } from "@/domain/contracts/favorites.contracts";
import {
  AddFavoritePayload,
  Favorite,
  FavoritesListResponse,
  RemoveFavoriteResponse,
} from "@/domain/types/favorites.types";

export class FavoritesRepository implements IFavoritesRepository {
  async list(): Promise<FavoritesListResponse> {
    const { data } = await api.get("/api/favorites/");
    return unwrap<FavoritesListResponse>(data);
  }

  async add(payload: AddFavoritePayload): Promise<Favorite> {
    const { data } = await api.post("/api/favorites/", payload);
    return unwrap<Favorite>(data);
  }

  async get(id: number): Promise<Favorite> {
    const { data } = await api.get(`/api/favorites/${id}/`);
    return unwrap<Favorite>(data);
  }

  async remove(id: number): Promise<RemoveFavoriteResponse> {
    const { data } = await api.delete(`/api/favorites/${id}/`);
    return unwrap<RemoveFavoriteResponse>(data);
  }
}

export const favoritesRepository = new FavoritesRepository();
