// Store exports - Central place to import all stores
export { default as useMovieStore } from './useMovieStore';
export { default as useFavoriteStore } from './useFavoriteStore';
export { default as useUIStore } from './useUIStore';

// Combined hook for components that need multiple stores
export const useAppStores = () => ({
  movieStore: useMovieStore(),
  favoriteStore: useFavoriteStore(),
  uiStore: useUIStore()
});