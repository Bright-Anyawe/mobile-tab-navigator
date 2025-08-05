import { StyleSheet, Button, Text, View } from 'react-native';
import { router } from 'expo-router';

// Home Screen Component
export default function HomeScreen() {
  const user = {
    name: 'Anyawe Bright',
    email: 'anyawe.work@gmail.com',
    avatar: 'https://example.com/avatar.jpg'
  };

  const navigateToProfile = () => {
    // Pass user data as query parameters with Expo Router
    router.push({
      pathname: '/profile',
      params: {
        userName: user.name,
        userEmail: user.email,
        userAvatar: user.avatar
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home</Text>
      <Text style={styles.subtitle}>User: {user.name}</Text>
      <View style={styles.buttonContainer}> 
        <Button
        title="Go to Profile"
        onPress={navigateToProfile}
        style={styles.fBtn}
      />
       <Button
         title="Open Modal"
              onPress={() => router.push('/modal')}
           />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 20,
    width: '80%',
  },
  fBtn: {
    marginBottom: 10,
  }
});
