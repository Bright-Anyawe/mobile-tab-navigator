import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import { Movie } from '../services/config';

interface FavoriteStore {
  // State
  favorites: Movie[];

  // Actions
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  toggleFavorite: (movie: Movie) => void;
  clearAllFavorites: () => void;
  
  // Getters
  getFavoriteCount: () => number;
  isFavorite: (movieId: number) => boolean;
  getFavoritesByGenre: (genre: string) => Movie[];
  getFavoritesByYear: (year: number) => Movie[];
  getRecentFavorites: (limit?: number) => Movie[];
}

// Minimal in-memory storage to avoid RN crash when no async storage is configured.
// NOTE: For real persistence across app restarts, install a storage library:
//  - Recommended: `npx expo install expo-secure-store` (or)
//  - `npm i @react-native-async-storage/async-storage`
// Then replace memoryStorage with the chosen storage using createJSONStorage.
const memoryStorage: StateStorage = {
  getItem: async (name) => {
    const store = (globalThis as any).__ZUSTAND_PERSIST__ || {};
    const value = store[name];
    return typeof value === 'string' ? value : null;
  },
  setItem: async (name, value) => {
    const g = (globalThis as any);
    g.__ZUSTAND_PERSIST__ = g.__ZUSTAND_PERSIST__ || {};
    g.__ZUSTAND_PERSIST__[name] = value;
  },
  removeItem: async (name) => {
    const g = (globalThis as any);
    if (g.__ZUSTAND_PERSIST__) {
      delete g.__ZUSTAND_PERSIST__[name];
    }
  },
};

// Favorite Store - Handles favorite movies with persistence
const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      // State
      favorites: [],

      // Actions
      addToFavorites: (movie) => {
        const { favorites } = get();
        const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
        
        if (!isAlreadyFavorite) {
          set((state) => ({
            favorites: [...state.favorites, movie]
          }));
        }
      },
      
      removeFromFavorites: (movieId) => set((state) => ({
        favorites: state.favorites.filter(movie => movie.id !== movieId)
      })),
      
      toggleFavorite: (movie) => {
        const { favorites } = get();
        const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
        
        if (isAlreadyFavorite) {
          set((state) => ({
            favorites: state.favorites.filter(fav => fav.id !== movie.id)
          }));
        } else {
          set((state) => ({
            favorites: [...state.favorites, movie]
          }));
        }
      },
      
      clearAllFavorites: () => set({ favorites: [] }),
      
      // Getters
      getFavoriteCount: () => get().favorites.length,
      
      isFavorite: (movieId) => {
        const { favorites } = get();
        return favorites.some(movie => movie.id === movieId);
      },
      
      getFavoritesByGenre: (genre) => {
        const { favorites } = get();
        return favorites.filter(movie => 
          movie.genre.toLowerCase().includes(genre.toLowerCase())
        );
      },

      getFavoritesByYear: (year) => {
        const { favorites } = get();
        return favorites.filter(movie => movie.year === year);
      },

      getRecentFavorites: (limit = 5) => {
        const { favorites } = get();
        // Return the most recently added favorites (last items in array)
        return favorites.slice(-limit).reverse();
      }
    }),
    {
      name: 'favorite-movies', // Storage key
      storage: createJSONStorage(() => memoryStorage),
      // Only persist favorites array
      partialize: (state) => ({ favorites: state.favorites })
    }
  )
);

export default useFavoriteStore;