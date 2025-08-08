import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useFavoriteStore from '../../stores/useFavoriteStore';
import useUIStore from '../../stores/useUIStore';
import { Movie } from '../../services/config';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, getFavoriteCount, clearAllFavorites, getRecentFavorites } = useFavoriteStore();
  const { refreshing, setRefreshing } = useUIStore();

  const handleRemoveFavorite = useCallback((movie: Movie) => {
    Alert.alert(
      'Remove Favorite',
      `Remove "${movie.title}" from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => toggleFavorite(movie)
        }
      ]
    );
  }, [toggleFavorite]);

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

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [setRefreshing]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAllFavorites }
      ]
    );
  }, [clearAllFavorites]);

  const renderFavoriteMovie = useCallback(({ item }: { item: Movie }) => (
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
        style={styles.removeButton}
        onPress={(e) => {
          e.stopPropagation();
          handleRemoveFavorite(item);
        }}
      >
        <Ionicons name="heart" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [handleMoviePress, handleRemoveFavorite]);

  const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 140,
    offset: 140 * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Favorites</Text>
      <Text style={styles.count}>
        {getFavoriteCount()} movie{getFavoriteCount() !== 1 ? 's' : ''} in favorites
      </Text>

      {/* Clear All Button */}
      {favorites.length > 0 && (
        <TouchableOpacity 
          style={styles.clearAllButton} 
          onPress={handleClearAll}
        >
          <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          <Text style={styles.clearAllText}>Clear All Favorites</Text>
        </TouchableOpacity>
      )}

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteMovie}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          style={styles.favoritesList}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#6200ea']}
              tintColor="#6200ea"
            />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
          <Text style={styles.emptyStateText}>
            Search for movies and add them to your favorites!
          </Text>
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
  count: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  favoritesList: {
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
  removeButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ccc',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 24,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  clearAllText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});