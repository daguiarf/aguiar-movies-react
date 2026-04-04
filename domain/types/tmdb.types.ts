import { MediaType } from "@/domain/enums/media-type.enum";

export interface TmdbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: TmdbGenre[];
  runtime?: number;
  status?: string;
  tagline?: string;
  credits?: TmdbCredits;
  videos?: TmdbVideoResults;
  media_type?: MediaType;
}

export interface TmdbTV {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: TmdbGenre[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  credits?: TmdbCredits;
  videos?: TmdbVideoResults;
  media_type?: MediaType;
}

export interface TmdbPerson {
  id: number;
  name: string;
  poster_path?: string | null;
  profile_path: string | null;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  popularity: number;
  movie_credits?: TmdbPersonCredits<TmdbMovie>;
  tv_credits?: TmdbPersonCredits<TmdbTV>;
  media_type?: MediaType;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TmdbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TmdbCredits {
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TmdbVideoResults {
  results: TmdbVideo[];
}

export interface TmdbPersonCredits<T> {
  cast: T[];
  crew: T[];
}

export type TmdbSearchResult = (TmdbMovie | TmdbTV | TmdbPerson) & {
  media_type: MediaType;
};

export interface TmdbSearchParams {
  query: string;
  page?: number;
}

export interface TmdbListParams {
  page?: number;
}

export interface GetGenresParams {
  type?: "movie" | "tv";
}

export interface DiscoverParams {
  page?: number;
  genres?: string;
}