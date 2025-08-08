import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useMovieStore from '../../../stores/useMovieStore';
import useUIStore from '../../../stores/useUIStore';

export default function AdvancedSearchScreen() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  
  const { searchMovies } = useMovieStore();
  const { setSearchLoading } = useUIStore();

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];

  const handleSearch = async () => {
    let searchQuery = title;
    if (genre) searchQuery += ` ${genre}`;
    if (year) searchQuery += ` ${year}`;
    
    if (searchQuery.trim()) {
      setSearchLoading(true);
      await searchMovies(searchQuery.trim());
      setSearchLoading(false);
      router.back(); // Go back to movies list
    }
  };

  const handleClear = () => {
    setTitle('');
    setGenre('');
    setYear('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Advanced Movie Search</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Movie Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter movie title..."
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Genre</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.genreContainer}>
            {genres.map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genreChip,
                  genre === g && styles.genreChipSelected
                ]}
                onPress={() => setGenre(genre === g ? '' : g)}
              >
                <Text style={[
                  styles.genreText,
                  genre === g && styles.genreTextSelected
                ]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Year</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter year (e.g., 2020)..."
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#fff" />
          <Text style={styles.searchButtonText}>Search Movies</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Ionicons name="refresh" size={20} color="#666" />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  genreChip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  genreChipSelected: {
    backgroundColor: '#6200ea',
    borderColor: '#6200ea',
  },
  genreText: {
    fontSize: 14,
    color: '#666',
  },
  genreTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 32,
  },
  searchButton: {
    backgroundColor: '#6200ea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  clearButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    marginLeft: 8,
  },
});