import api from "@/infra/http/api";
import { unwrap } from "@/infra/http/unwrap";
import { ITmdbRepository } from "@/domain/contracts/tmdb.contracts";
import {
  TmdbGenre,
  TmdbListParams,
  TmdbMovie,
  TmdbPaginatedResponse,
  TmdbPerson,
  TmdbSearchParams,
  TmdbSearchResult,
  TmdbTV,
} from "@/domain/types/tmdb.types";

const LANG = { language: "pt" };

export class TmdbRepository implements ITmdbRepository {
  async getPopularMovies(params?: { page?: number; genres?: string }) {
    const { data } = await api.get("/api/movies/popular/", {
      params: { ...LANG, ...params },
    });

    return unwrap<TmdbPaginatedResponse<TmdbMovie>>(data);
  }

  async getPopularTV(params?: { page?: number; genres?: string }) {
    const { data } = await api.get("/api/tv/popular/", {
      params: { ...LANG, ...params },
    });

    return unwrap<TmdbPaginatedResponse<TmdbTV>>(data);
  }

  async search(params: TmdbSearchParams): Promise<TmdbPaginatedResponse<TmdbSearchResult>> {
    const { data } = await api.get("/api/movies/search/", { params: { ...LANG, ...params } });
    return unwrap<TmdbPaginatedResponse<TmdbSearchResult>>(data);
  }

  async getMovieDetails(tmdbId: number): Promise<TmdbMovie> {
    const { data } = await api.get(`/api/movies/${tmdbId}/`, { params: LANG });
    return unwrap<TmdbMovie>(data);
  }

  async getTVDetails(tmdbId: number): Promise<TmdbTV> {
    const { data } = await api.get(`/api/tv/${tmdbId}/`, { params: LANG });
    return unwrap<TmdbTV>(data);
  }

  async getPersonDetails(tmdbId: number): Promise<TmdbPerson> {
    const { data } = await api.get(`/api/person/${tmdbId}/`, { params: LANG });
    return unwrap<TmdbPerson>(data);
  }

  async getGenres(type: "movie" | "tv" = "movie") {
    const { data } = await api.get("/api/genres/", {
      params: { type },
    });

    return unwrap<{ genres: TmdbGenre[] }>(data);
  }
}

export const tmdbRepository = new TmdbRepository();
