import { create } from 'zustand';
import movieService from '../services/movieService';
import { Movie, MovieDetails, SearchResult } from '../services/config';

interface MovieStore {
  // State
  movies: Movie[];
  searchQuery: string;
  selectedMovie: MovieDetails | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;

  // Actions
  setMovies: (movies: Movie[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedMovie: (movie: MovieDetails | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  searchMovies: (query: string, page?: number) => Promise<void>;
  loadMoreMovies: () => Promise<void>;
  clearSearch: () => void;
  getMovieDetails: (movieId: number) => Promise<MovieDetails | null>;
  getPopularMovies: (page?: number) => Promise<void>;
  getTopRatedMovies: (page?: number) => Promise<void>;
  refreshMovies: () => Promise<void>;

  // Getters
  getMovieById: (id: number) => Movie | undefined;
  isApiConfigured: () => boolean;
}

// Movie Store - Handles movie data and search functionality
const useMovieStore = create<MovieStore>((set, get) => ({
  // State
  movies: [],
  searchQuery: '',
  selectedMovie: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,

  // Actions
  setMovies: (movies) => set({ movies }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  searchMovies: async (query, page = 1) => {
    const state = get();
    
    // If it's a new search, reset the movies array
    if (page === 1) {
      set({ 
        searchQuery: query, 
        loading: true, 
        error: null, 
        movies: [],
        currentPage: 1 
      });
    } else {
      set({ loading: true, error: null });
    }

    try {
      // Check if API is configured
      if (!movieService.isConfigured()) {
        // Fallback to mock data if API key not configured
        const mockMovies = movieService.getMockMovies(query);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newMovies = page === 1 ? mockMovies : [...state.movies, ...mockMovies];
        set({ 
          movies: newMovies, 
          loading: false,
          currentPage: page,
          totalPages: 1,
          hasMore: false
        });
        return;
      }

      // Use real API
      const result = await movieService.searchMovies(query, page);
      const newMovies = page === 1 ? result.movies : [...state.movies, ...result.movies];
      
      set({ 
        movies: newMovies,
        loading: false,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.currentPage < result.totalPages
      });
    } catch (error) {
      console.error('Error searching movies:', error);
      set({ 
        loading: false, 
        error: error.message || 'Failed to search movies'
      });
      
      // Fallback to mock data on error
      if (page === 1) {
        const mockMovies = movieService.getMockMovies(query);
        set({ movies: mockMovies });
      }
    }
  },

  loadMoreMovies: async () => {
    const { searchQuery, currentPage, hasMore, loading } = get();
    
    if (!hasMore || loading || !searchQuery) return;
    
    await get().searchMovies(searchQuery, currentPage + 1);
  },
  
  clearSearch: () => set({ 
    movies: [], 
    searchQuery: '', 
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
    error: null
  }),
  
  getMovieDetails: async (movieId) => {
    set({ loading: true, error: null });
    
    try {
      if (!movieService.isConfigured()) {
        // Return mock detailed data if API not configured
        const { movies } = get();
        const movie = movies.find(m => m.id === movieId);
        set({ loading: false });
        return movie as MovieDetails || null;
      }
      
      const movieDetails = await movieService.getMovieDetails(movieId);
      set({ selectedMovie: movieDetails, loading: false });
      return movieDetails;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch movie details'
      });
      return null;
    }
  },

  getPopularMovies: async (page = 1) => {
    const state = get();
    
    if (page === 1) {
      set({ loading: true, error: null, movies: [], currentPage: 1 });
    } else {
      set({ loading: true, error: null });
    }

    try {
      if (!movieService.isConfigured()) {
        // Return mock popular movies
        const mockPopular = movieService.getMockMovies().slice(0, 3);
        const newMovies = page === 1 ? mockPopular : [...state.movies, ...mockPopular];
        
        set({ 
          movies: newMovies, 
          loading: false,
          searchQuery: 'Popular Movies',
          currentPage: page,
          totalPages: 1,
          hasMore: false
        });
        return;
      }
      
      const result = await movieService.getPopularMovies(page);
      const newMovies = page === 1 ? result.movies : [...state.movies, ...result.movies];
      
      set({ 
        movies: newMovies,
        loading: false,
        searchQuery: 'Popular Movies',
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.currentPage < result.totalPages
      });
    } catch (error: any) {
      console.error('Error fetching popular movies:', error);
      // Fallback to mock on API error for consistent UX
      const mockPopular = movieService.getMockMovies().slice(0, 3);
      const newMovies = page === 1 ? mockPopular : [...state.movies, ...mockPopular];
      set({ 
        movies: newMovies,
        loading: false, 
        error: error?.message || 'Failed to fetch popular movies, showing mock data',
        searchQuery: 'Popular Movies',
        currentPage: page,
        totalPages: 1,
        hasMore: false
      });
    }
  },

  getTopRatedMovies: async (page = 1) => {
    const state = get();
    
    if (page === 1) {
      set({ loading: true, error: null, movies: [], currentPage: 1 });
    } else {
      set({ loading: true, error: null });
    }

    try {
      if (!movieService.isConfigured()) {
        // Return mock top rated movies
        const mockTopRated = movieService.getMockMovies().slice(0, 3);
        const newMovies = page === 1 ? mockTopRated : [...state.movies, ...mockTopRated];
        
        set({ 
          movies: newMovies, 
          loading: false,
          searchQuery: 'Top Rated Movies',
          currentPage: page,
          totalPages: 1,
          hasMore: false
        });
        return;
      }
      
      const result = await movieService.getTopRatedMovies(page);
      const newMovies = page === 1 ? result.movies : [...state.movies, ...result.movies];
      
      set({ 
        movies: newMovies,
        loading: false,
        searchQuery: 'Top Rated Movies',
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        hasMore: result.currentPage < result.totalPages
      });
    } catch (error: any) {
      console.error('Error fetching top rated movies:', error);
      // Fallback to mock on API error for consistent UX
      const mockTopRated = movieService.getMockMovies().slice(0, 3);
      const newMovies = page === 1 ? mockTopRated : [...state.movies, ...mockTopRated];
      set({ 
        movies: newMovies, 
        loading: false, 
        error: error?.message || 'Failed to fetch top rated movies, showing mock data',
        searchQuery: 'Top Rated Movies',
        currentPage: page,
        totalPages: 1,
        hasMore: false
      });
    }
  },

  refreshMovies: async () => {
    const { searchQuery } = get();
    if (searchQuery === 'Popular Movies') {
      await get().getPopularMovies(1);
    } else if (searchQuery === 'Top Rated Movies') {
      await get().getTopRatedMovies(1);
    } else if (searchQuery) {
      await get().searchMovies(searchQuery, 1);
    }
  },

  // Getters
  getMovieById: (id) => {
    const { movies } = get();
    return movies.find(movie => movie.id === id);
  },

  // Check if API is configured
  isApiConfigured: () => movieService.isConfigured()
}));

export default useMovieStore;