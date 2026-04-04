import {
  TmdbListParams,
  TmdbMovie,
  TmdbPaginatedResponse,
  TmdbPerson,
  TmdbSearchParams,
  TmdbSearchResult,
  TmdbTV,
  TmdbGenre,
} from "@/domain/types/tmdb.types";

export interface ITmdbRepository {
  getPopularMovies(params?: TmdbListParams & { genres?: string }): Promise<TmdbPaginatedResponse<TmdbMovie>>;
  getPopularTV(params?: TmdbListParams & { genres?: string }): Promise<TmdbPaginatedResponse<TmdbTV>>;
  getGenres(type?: "movie" | "tv"): Promise<{ genres: TmdbGenre[] }>;

  search(params: TmdbSearchParams): Promise<TmdbPaginatedResponse<TmdbSearchResult>>;
  getMovieDetails(tmdbId: number): Promise<TmdbMovie>;
  getTVDetails(tmdbId: number): Promise<TmdbTV>;
  getPersonDetails(tmdbId: number): Promise<TmdbPerson>;
}