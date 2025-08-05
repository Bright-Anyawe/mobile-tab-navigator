import { StyleSheet, Button, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function ProfileScreen() {
  // Get the parameters passed from the previous screen
  const { userName, userEmail, userAvatar } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile: {userName}</Text>
      <Text style={styles.email}>Email: {userEmail}</Text>
      <Text style={styles.info}>Avatar: {userAvatar}</Text>
      
      <Button
        title="Go Back"
        onPress={() => router.back()}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  email: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
});
