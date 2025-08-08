import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useFavoriteStore from '../../../stores/useFavoriteStore';

export default function MovieDetailsScreen() {
  const { movieId, title, year, genre } = useLocalSearchParams();
  const { toggleFavorite, isFavorite } = useFavoriteStore();

  const movie = {
    id: parseInt(movieId as string),
    title: title as string,
    year: parseInt(year as string),
    genre: genre as string
  };

  const handleToggleFavorite = () => {
    toggleFavorite(movie);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{movie.title}</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Ionicons
            name={isFavorite(movie.id) ? 'heart' : 'heart-outline'}
            size={32}
            color={isFavorite(movie.id) ? '#e74c3c' : '#666'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Year:</Text>
          <Text style={styles.value}>{movie.year}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Genre:</Text>
          <Text style={styles.value}>{movie.genre}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          This is a sample movie description. In a real app, you would fetch this data from an API 
          and display detailed information about the movie including plot, cast, ratings, and more.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cast & Crew</Text>
        <Text style={styles.description}>
          • Director: Sample Director{'\n'}
          • Starring: Actor 1, Actor 2, Actor 3{'\n'}
          • Producer: Sample Producer
        </Text>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backButtonText}>Back to Movies</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  favoriteButton: {
    padding: 8,
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 80,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  backButton: {
    backgroundColor: '#6200ea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});