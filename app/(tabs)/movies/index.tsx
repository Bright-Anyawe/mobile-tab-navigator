import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useMovieStore from '../../../stores/useMovieStore';
import useFavoriteStore from '../../../stores/useFavoriteStore';
import useUIStore from '../../../stores/useUIStore';
import { Movie } from '../../../services/config';

export default function MoviesScreen() {
  const [searchInput, setSearchInput] = useState('');
  
  // Using stores with proper TypeScript support
  const { 
    movies, 
    searchQuery, 
    loading,
    error,
    hasMore,
    searchMovies, 
    loadMoreMovies,
    clearSearch, 
    getPopularMovies, 
    getTopRatedMovies,
    refreshMovies,
    isApiConfigured 
  } = useMovieStore();
  const { toggleFavorite, isFavorite, getFavoriteCount } = useFavoriteStore();
  const { refreshing, setRefreshing } = useUIStore();

  const handleSearch = useCallback(async () => {
    if (searchInput.trim()) {
      await searchMovies(searchInput.trim());
    }
  }, [searchInput, searchMovies]);

  const handleClear = useCallback(() => {
    setSearchInput('');
    clearSearch();
  }, [clearSearch]);

  const handleToggleFavorite = useCallback((movie: Movie) => {
    const wasFavorite = isFavorite(movie.id);
    toggleFavorite(movie);
    const nowFavorite = !wasFavorite;
    Alert.alert(
      'Favorites',
      `${movie.title} ${nowFavorite ? 'added to' : 'removed from'} favorites!`
    );
  }, [toggleFavorite, isFavorite]);

  const handleMoviePress = useCallback((movie: Movie) => {
    router.push({
      pathname: '/movies/details',
      params: {
        movieId: movie.id.toString(),
        title: movie.title,
        year: movie.year.toString(),
        genre: movie.genre
      }
    });
  }, []);

  const handleAdvancedSearch = useCallback(() => {
    router.push('/movies/search');
  }, []);

  const handleLoadPopular = useCallback(async () => {
    try {
      await getPopularMovies();
    } catch (error) {
      Alert.alert('Error', 'Failed to load popular movies. Please try again.');
    }
  }, [getPopularMovies]);

  const handleLoadTopRated = useCallback(async () => {
    try {
      await getTopRatedMovies();
    } catch (error) {
      Alert.alert('Error', 'Failed to load top rated movies. Please try again.');
    }
  }, [getTopRatedMovies]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshMovies();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh movies. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, [refreshMovies, setRefreshing]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMoreMovies();
    }
  }, [hasMore, loading, loadMoreMovies]);

  const renderMovie = useCallback(({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.7}
    >
      {item.posterPath && (
        <Image 
          source={{ uri: item.posterPath }}
          style={styles.moviePoster}
          resizeMode="cover"
        />
      )}
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.movieDetails}>{item.year} • {item.genre}</Text>
        {item.rating > 0 && (
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#ffd700" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
        {item.overview && (
          <Text style={styles.movieOverview} numberOfLines={2}>
            {item.overview}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={(e) => {
          e.stopPropagation();
          handleToggleFavorite(item);
        }}
      >
        <Ionicons
          name={isFavorite(item.id) ? 'heart' : 'heart-outline'}
          size={24}
          color={isFavorite(item.id) ? '#e74c3c' : '#666'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [handleMoviePress, handleToggleFavorite, isFavorite]);

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#6200ea" />
        <Text style={styles.footerText}>Loading more movies...</Text>
      </View>
    );
  }, [hasMore]);

  const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 140, // Approximate height of each item
    offset: 140 * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Search</Text>
      <Text style={styles.favoriteCount}>
        Favorites: {getFavoriteCount()}
      </Text>

      {/* Search Section */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for movies..."
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
        {searchQuery && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.advancedSearchButton} onPress={handleAdvancedSearch}>
          <Ionicons name="options" size={16} color="#6200ea" />
          <Text style={styles.advancedSearchText}>Advanced</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.popularButton} onPress={handleLoadPopular}>
          <Ionicons name="trending-up" size={16} color="#fff" />
          <Text style={styles.popularButtonText}>Popular</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.topRatedButton} onPress={handleLoadTopRated}>
          <Ionicons name="star" size={16} color="#fff" />
          <Text style={styles.topRatedButtonText}>Top Rated</Text>
        </TouchableOpacity>
      </View>

      {/* API Status Indicator */}
      <View style={styles.apiStatus}>
        <Ionicons 
          name={isApiConfigured() ? 'cloud-done' : 'cloud-offline'} 
          size={16} 
          color={isApiConfigured() ? '#4caf50' : '#ff9800'} 
        />
        <Text style={[styles.apiStatusText, { color: isApiConfigured() ? '#4caf50' : '#ff9800' }]}>
          {isApiConfigured() ? 'Real API Data' : 'Mock Data (Configure API key for real data)'}
        </Text>
      </View>

      {/* Current Search Query */}
      {searchQuery && (
        <Text style={styles.searchQuery}>
          Searching for: "{searchQuery}"
        </Text>
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Indicator */}
      {loading && movies.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ea" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      )}

      {/* Movies List */}
      {movies.length > 0 && (
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          style={styles.moviesList}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#6200ea']}
              tintColor="#6200ea"
            />
          }
        />
      )}

      {/* No Results */}
      {!loading && searchQuery && movies.length === 0 && !error && (
        <View style={styles.noResults}>
          <Ionicons name="film-outline" size={48} color="#ccc" />
          <Text style={styles.noResultsText}>No movies found for "{searchQuery}"</Text>
          <Text style={styles.noResultsSubtext}>Try a different search term</Text>
        </View>
      )}

      {/* Initial State */}
      {!searchQuery && !loading && movies.length === 0 && !error && (
        <View style={styles.initialState}>
          <Ionicons name="search-outline" size={48} color="#ccc" />
          <Text style={styles.initialStateText}>Search for your favorite movies</Text>
          <Text style={styles.initialStateSubtext}>or browse popular and top rated movies</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  favoriteCount: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#6200ea',
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clearButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchQuery: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  moviesList: {
    flex: 1,
  },
  movieCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minHeight: 140,
  },
  moviePoster: {
    width: 80,
    height: 120,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  movieInfo: {
    flex: 1,
    paddingRight: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  movieDetails: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  movieOverview: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  favoriteButton: {
    padding: 8,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 16,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 8,
    textAlign: 'center',
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  initialStateText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 16,
    textAlign: 'center',
  },
  initialStateSubtext: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerLoader: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  advancedSearchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#6200ea',
    borderRadius: 8,
    padding: 10,
  },
  advancedSearchText: {
    color: '#6200ea',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  popularButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 10,
  },
  popularButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  topRatedButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9800',
    borderRadius: 8,
    padding: 10,
  },
  topRatedButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  apiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  apiStatusText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
});