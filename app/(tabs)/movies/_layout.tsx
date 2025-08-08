import { Stack } from 'expo-router';

export default function MoviesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Movies',
          headerShown: false // Hide header since tab already shows title
        }} 
      />
      <Stack.Screen 
        name="details" 
        options={{ 
          title: 'Movie Details',
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen 
        name="search" 
        options={{ 
          title: 'Advanced Search',
          headerBackTitle: 'Movies'
        }} 
      />
    </Stack>
  );
}