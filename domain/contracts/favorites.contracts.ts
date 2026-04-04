import {
  AddFavoritePayload,
  Favorite,
  FavoritesListResponse,
  RemoveFavoriteResponse,
} from "@/domain/types/favorites.types";

export interface IFavoritesRepository {
  list(): Promise<FavoritesListResponse>;
  add(payload: AddFavoritePayload): Promise<Favorite>;
  get(id: number): Promise<Favorite>;
  remove(id: number): Promise<RemoveFavoriteResponse>;
}
