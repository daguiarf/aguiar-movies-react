import { tmdbRepository } from "@/infra/repositories/tmdb.repository";
import { TmdbListParams, TmdbSearchParams } from "@/domain/types/tmdb.types";

export const tmdbService = {
  getPopularMovies: (params?: TmdbListParams & { genres?: string }) =>
    tmdbRepository.getPopularMovies(params),

  getPopularTV: (params?: TmdbListParams & { genres?: string }) =>
    tmdbRepository.getPopularTV(params),

  getGenres: (type?: "movie" | "tv") =>
    tmdbRepository.getGenres(type),

  search: (params: TmdbSearchParams) =>
    tmdbRepository.search(params),

  getMovieDetails: (tmdbId: number) =>
    tmdbRepository.getMovieDetails(tmdbId),

  getTVDetails: (tmdbId: number) =>
    tmdbRepository.getTVDetails(tmdbId),

  getPersonDetails: (tmdbId: number) =>
    tmdbRepository.getPersonDetails(tmdbId),

  buildImageUrl(path: string | null, size = "w500"): string {
    if (!path) return "/placeholder-poster.png";
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  buildBackdropUrl(path: string | null): string {
    if (!path) return "/placeholder-backdrop.jpg";
    return `https://image.tmdb.org/t/p/original${path}`;
  },
};