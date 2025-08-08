// services/config.ts
// API Configuration with TypeScript support

// Get API key from environment or fallback
const getApiKey = (): string => {
  // In React Native/Expo, environment variables are available at build time
  // For development, you can set EXPO_PUBLIC_TMDB_API_KEY in your .env file
  return process.env.EXPO_PUBLIC_TMDB_API_KEY || 'your_tmdb_api_key_here';
};

// TMDB API Configuration
export const TMDB_CONFIG = {
  // Get API key from environment variables
  API_KEY: getApiKey(),
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  
  // Image sizes available
  IMAGE_SIZES: {
    POSTER: {
      SMALL: 'w185',
      MEDIUM: 'w342',
      LARGE: 'w500',
      XLARGE: 'w780',
      ORIGINAL: 'original'
    },
    BACKDROP: {
      SMALL: 'w300',
      MEDIUM: 'w780',
      LARGE: 'w1280',
      ORIGINAL: 'original'
    },
    PROFILE: {
      SMALL: 'w45',
      MEDIUM: 'w185',
      LARGE: 'h632',
      ORIGINAL: 'original'
    }
  }
} as const;

// API Endpoints
export const ENDPOINTS = {
  SEARCH_MOVIES: '/search/movie',
  MOVIE_DETAILS: '/movie',
  POPULAR_MOVIES: '/movie/popular',
  TOP_RATED_MOVIES: '/movie/top_rated',
  UPCOMING_MOVIES: '/movie/upcoming',
  NOW_PLAYING_MOVIES: '/movie/now_playing',
  DISCOVER_MOVIES: '/discover/movie',
  GENRES: '/genre/movie/list'
} as const;

// Request configuration
export const REQUEST_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
} as const;

// Type definitions for API responses
export interface Movie {
  id: number;
  title: string;
  year: number | string;
  genre: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number;
  voteCount: number;
  popularity: number;
  releaseDate: string;
  originalTitle: string;
  adult: boolean;
}

export interface MovieDetails extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  genres: Genre[];
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
  homepage: string;
  imdbId: string;
  cast: CastMember[];
  crew: CrewMember[];
  videos: Video[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  profilePath: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
}

export interface ApiResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
  page: number;
}

export interface SearchResult {
  movies: Movie[];
  totalPages: number;
  totalResults: number;
  currentPage: number;
}