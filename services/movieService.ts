// services/movieService.ts
// Movie API Service - Functional style (no classes) with TypeScript support

import {
  TMDB_CONFIG,
  ENDPOINTS,
  REQUEST_CONFIG,
  Movie,
  MovieDetails,
  SearchResult,
  ApiResponse,
  Genre,
} from './config';

// Module-scoped configuration (captured by functions)
const baseUrl = TMDB_CONFIG.BASE_URL;
const apiKey = TMDB_CONFIG.API_KEY;
const imageBaseUrl = TMDB_CONFIG.IMAGE_BASE_URL;

// Core request helper with timeout + retry/backoff and richer errors
async function makeRequest<T>(url: string, retries = REQUEST_CONFIG.RETRY_ATTEMPTS): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_CONFIG.TIMEOUT);

  const parsePath = (u: string) => {
    try {
      const { pathname } = new URL(u);
      return pathname;
    } catch {
      return u;
    }
  };

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle rate limiting with Retry-After if available
      if (response.status === 429 && retries > 0) {
        const retryAfter = response.headers.get('retry-after');
        const waitMs = retryAfter
          ? Number(retryAfter) * 1000
          : REQUEST_CONFIG.RETRY_DELAY * Math.pow(2, REQUEST_CONFIG.RETRY_ATTEMPTS - retries) + Math.floor(Math.random() * 200);
        await new Promise((r) => setTimeout(r, waitMs));
        return makeRequest<T>(url, retries - 1);
      }

      if (response.status === 401) {
        throw new Error(
          `Invalid API key while calling ${parsePath(url)}. Please check your TMDB API key configuration.`
        );
      }
      if (response.status === 404) {
        throw new Error(`Resource not found at ${parsePath(url)}.`);
      }
      if (response.status >= 500 && retries > 0) {
        const waitMs = REQUEST_CONFIG.RETRY_DELAY * Math.pow(2, REQUEST_CONFIG.RETRY_ATTEMPTS - retries) + Math.floor(Math.random() * 200);
        await new Promise((r) => setTimeout(r, waitMs));
        return makeRequest<T>(url, retries - 1);
      }
      throw new Error(`HTTP error ${response.status} when calling ${parsePath(url)}.`);
    }

    const data = await response.json();
    return data as T;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const error = err as { name?: string; message?: string };

    if (error?.name === 'AbortError') {
      throw new Error('Request timeout. Please check your internet connection.', { cause: err as any });
    }

    // Distinguish typical offline/network errors
    const msg = (error?.message || '').toLowerCase();
    const isNetworkError =
      msg.includes('network') ||
      msg.includes('failed to fetch') ||
      msg.includes('fetch') ||
      (typeof navigator !== 'undefined' && (navigator as any)?.onLine === false);

    if (retries > 0 && isNetworkError) {
      const waitMs = REQUEST_CONFIG.RETRY_DELAY * Math.pow(2, REQUEST_CONFIG.RETRY_ATTEMPTS - retries) + Math.floor(Math.random() * 200);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      return makeRequest<T>(url, retries - 1);
    }

    throw new Error(`Request failed for ${parsePath(url)}: ${error?.message || 'Unknown error'}`, { cause: err as any });
  }
}

// Transform helpers
function transformMovie(movie: any): Movie {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown',
    genre: movie.genre_ids ? movie.genre_ids.join(', ') : 'Unknown',
    overview: movie.overview || 'No overview available',
    posterPath: movie.poster_path ? `${imageBaseUrl}/w500${movie.poster_path}` : null,
    backdropPath: movie.backdrop_path ? `${imageBaseUrl}/w1280${movie.backdrop_path}` : null,
    rating: movie.vote_average || 0,
    voteCount: movie.vote_count || 0,
    popularity: movie.popularity || 0,
    releaseDate: movie.release_date || '',
    originalTitle: movie.original_title || movie.title,
    adult: movie.adult || false,
  };
}

function transformMovieDetails(movie: any): MovieDetails {
  return {
    ...transformMovie(movie),
    runtime: movie.runtime || 0,
    budget: movie.budget || 0,
    revenue: movie.revenue || 0,
    genres: movie.genres || [],
    productionCompanies: movie.production_companies || [],
    productionCountries: movie.production_countries || [],
    spokenLanguages: movie.spoken_languages || [],
    status: movie.status || 'Unknown',
    tagline: movie.tagline || '',
    homepage: movie.homepage || '',
    imdbId: movie.imdb_id || '',
    cast:
      movie.credits?.cast
        ?.slice(0, 10)
        .map((person: any) => ({
          id: person.id,
          name: person.name,
          character: person.character,
          profilePath: person.profile_path ? `${imageBaseUrl}/w185${person.profile_path}` : null,
        })) || [],
    crew:
      movie.credits?.crew
        ?.filter((person: any) => ['Director', 'Producer', 'Writer'].includes(person.job))
        .map((person: any) => ({
          id: person.id,
          name: person.name,
          job: person.job,
          profilePath: person.profile_path ? `${imageBaseUrl}/w185${person.profile_path}` : null,
        })) || [],
    videos:
      movie.videos?.results
        ?.filter((video: any) => video.site === 'YouTube' && video.type === 'Trailer')
        .map((video: any) => ({
          id: video.id,
          key: video.key,
          name: video.name,
          type: video.type,
          site: video.site,
        })) || [],
  };
}

// Public API (functional)
async function searchMovies(query: string, page = 1): Promise<SearchResult> {
  try {
    const url = `${baseUrl}${ENDPOINTS.SEARCH_MOVIES}?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=${page}`;
    const data = await makeRequest<ApiResponse<any>>(url);

    return {
      movies: data.results.map(transformMovie),
      totalPages: data.total_pages,
      totalResults: data.total_results,
      currentPage: data.page,
    };
  } catch (error: any) {
    console.error('Error searching movies:', error);
    throw new Error(`Failed to search movies: ${error.message}`);
  }
}

async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  try {
    const url = `${baseUrl}${ENDPOINTS.MOVIE_DETAILS}/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`;
    const data = await makeRequest<any>(url);
    return transformMovieDetails(data);
  } catch (error: any) {
    console.error('Error fetching movie details:', error);
    throw new Error(`Failed to fetch movie details: ${error.message}`);
  }
}

async function getPopularMovies(page = 1): Promise<SearchResult> {
  try {
    const url = `${baseUrl}${ENDPOINTS.POPULAR_MOVIES}?api_key=${apiKey}&page=${page}`;
    const data = await makeRequest<ApiResponse<any>>(url);

    return {
      movies: data.results.map(transformMovie),
      totalPages: data.total_pages,
      totalResults: data.total_results,
      currentPage: data.page,
    };
  } catch (error: any) {
    console.error('Error fetching popular movies:', error);
    throw new Error(`Failed to fetch popular movies: ${error.message}`);
  }
}

async function getTopRatedMovies(page = 1): Promise<SearchResult> {
  try {
    const url = `${baseUrl}${ENDPOINTS.TOP_RATED_MOVIES}?api_key=${apiKey}&page=${page}`;
    const data = await makeRequest<ApiResponse<any>>(url);

    return {
      movies: data.results.map(transformMovie),
      totalPages: data.total_pages,
      totalResults: data.total_results,
      currentPage: data.page,
    };
  } catch (error: any) {
    console.error('Error fetching top rated movies:', error);
    throw new Error(`Failed to fetch top rated movies: ${error.message}`);
  }
}

async function getMoviesByGenre(genreId: number, page = 1): Promise<SearchResult> {
  try {
    const url = `${baseUrl}${ENDPOINTS.DISCOVER_MOVIES}?api_key=${apiKey}&with_genres=${genreId}&page=${page}`;
    const data = await makeRequest<ApiResponse<any>>(url);

    return {
      movies: data.results.map(transformMovie),
      totalPages: data.total_pages,
      totalResults: data.total_results,
      currentPage: data.page,
    };
  } catch (error: any) {
    console.error('Error fetching movies by genre:', error);
    throw new Error(`Failed to fetch movies by genre: ${error.message}`);
  }
}

async function getGenres(): Promise<Genre[]> {
  try {
    const url = `${baseUrl}${ENDPOINTS.GENRES}?api_key=${apiKey}`;
    const data = await makeRequest<{ genres: Genre[] }>(url);
    return data.genres;
  } catch (error: any) {
    console.error('Error fetching genres:', error);
    throw new Error(`Failed to fetch genres: ${error.message}`);
  }
}

function getImageUrl(path: string | null, size = 'w500'): string | null {
  if (!path) return null;
  return `${imageBaseUrl}/${size}${path}`;
}

function isConfigured(): boolean {
  return Boolean(apiKey && apiKey !== 'your_tmdb_api_key_here');
}

function getMockMovies(query?: string): Movie[] {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'The Matrix',
      year: 1999,
      genre: 'Sci-Fi',
      overview:
        'A computer programmer discovers that reality as he knows it is a simulation controlled by machines.',
      posterPath: null,
      backdropPath: null,
      rating: 8.7,
      voteCount: 15000,
      popularity: 85.5,
      releaseDate: '1999-03-31',
      originalTitle: 'The Matrix',
      adult: false,
    },
    {
      id: 2,
      title: 'Inception',
      year: 2010,
      genre: 'Sci-Fi',
      overview: 'A thief who enters the dreams of others to steal secrets from their subconscious.',
      posterPath: null,
      backdropPath: null,
      rating: 8.8,
      voteCount: 20000,
      popularity: 90.2,
      releaseDate: '2010-07-16',
      originalTitle: 'Inception',
      adult: false,
    },
    {
      id: 3,
      title: 'The Dark Knight',
      year: 2008,
      genre: 'Action',
      overview: "Batman faces the Joker in a battle for Gotham City's soul.",
      posterPath: null,
      backdropPath: null,
      rating: 9.0,
      voteCount: 25000,
      popularity: 95.8,
      releaseDate: '2008-07-18',
      originalTitle: 'The Dark Knight',
      adult: false,
    },
    {
      id: 4,
      title: 'Pulp Fiction',
      year: 1994,
      genre: 'Crime',
      overview: 'The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine.',
      posterPath: null,
      backdropPath: null,
      rating: 8.9,
      voteCount: 18000,
      popularity: 88.4,
      releaseDate: '1994-10-14',
      originalTitle: 'Pulp Fiction',
      adult: false,
    },
    {
      id: 5,
      title: 'Forrest Gump',
      year: 1994,
      genre: 'Drama',
      overview: 'A man with low IQ experiences and influences several historical events.',
      posterPath: null,
      backdropPath: null,
      rating: 8.8,
      voteCount: 22000,
      popularity: 87.6,
      releaseDate: '1994-07-06',
      originalTitle: 'Forrest Gump',
      adult: false,
    },
    {
      id: 6,
      title: 'Avatar',
      year: 2009,
      genre: 'Sci-Fi',
      overview:
        'A paraplegic Marine dispatched to the moon Pandora joins a mission to mine a precious mineral.',
      posterPath: null,
      backdropPath: null,
      rating: 7.8,
      voteCount: 16000,
      popularity: 82.3,
      releaseDate: '2009-12-18',
      originalTitle: 'Avatar',
      adult: false,
    },
  ];

  if (query) {
    return mockMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.toLowerCase().includes(query.toLowerCase()) ||
        movie.year.toString().includes(query)
    );
  }

  return mockMovies;
}

// Default export keeps the same import style across the app
const movieService = {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  getGenres,
  getImageUrl,
  isConfigured,
  getMockMovies,
};

export default movieService;

// Also export named functions if preferred
export {
  searchMovies,
  getMovieDetails,
  getPopularMovies,
  getTopRatedMovies,
  getMoviesByGenre,
  getGenres,
  getImageUrl,
  isConfigured,
  getMockMovies,
};