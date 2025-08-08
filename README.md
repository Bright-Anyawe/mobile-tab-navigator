# 🎬 Mobile Tab Navigator - Movie App

A React Native/Expo mobile application with tab navigation featuring movie search, favorites, and detailed movie information using The Movie Database (TMDB) API.

## ✨ Features

### 🎯 Core Functionality
- **Movie Search**: Real-time search with TMDB API integration
- **Favorites Management**: Add/remove movies from favorites with persistence
- **Movie Details**: Detailed movie information including cast, ratings, and trailers
- **Tab Navigation**: Intuitive navigation between different sections
- **Optimized Performance**: FlatList optimizations for smooth scrolling

### 📱 Screens
- **Home**: Welcome screen with navigation options
- **Movies**: Search and browse movies with advanced filtering
- **Favorites**: Manage your favorite movies
- **Profile**: User profile and settings
- **Settings**: App configuration options

### 🚀 Performance Features
- **Optimized FlatList**: Includes `removeClippedSubviews`, `getItemLayout`, and pagination
- **Image Caching**: Efficient image loading with fallbacks
- **Pull-to-Refresh**: Refresh content with pull gesture
- **Infinite Scrolling**: Load more content automatically
- **Error Handling**: Comprehensive error handling with retry options
- **Loading States**: Proper loading indicators throughout the app

## 🛠️ Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with tab navigation
- **State Management**: Zustand with persistence
- **API**: The Movie Database (TMDB) API
- **Language**: TypeScript for type safety
- **Styling**: React Native StyleSheet

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **Expo CLI** (`npm install -g @expo/cli`)
3. **TMDB API Key** (free from [themoviedb.org](https://www.themoviedb.org/))

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mobile-tab-navigator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Key
1. Get your free API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Open `.env` file
3. Replace `your_tmdb_api_key_here` with your actual API key:
```env
EXPO_PUBLIC_TMDB_API_KEY=your_actual_api_key_here
```

### 4. Start the Development Server
```bash
npm start
```

### 5. Run on Device/Simulator
- **iOS**: Press `i` or scan QR code with Camera app
- **Android**: Press `a` or scan QR code with Expo Go app
- **Web**: Press `w` to open in browser

## 🔧 API Configuration

### Getting TMDB API Key

1. **Create Account**: Sign up at [themoviedb.org](https://www.themoviedb.org/)
2. **Request API Key**: Go to [API Settings](https://www.themoviedb.org/settings/api)
3. **Choose Developer**: Select "Developer" option
4. **Fill Application**: Complete the application form
5. **Get Key**: Copy your API key

### Environment Variables

The app uses environment variables for configuration:

```env
# .env file
EXPO_PUBLIC_TMDB_API_KEY=your_api_key_here
```

**Important**: 
- Environment variables in Expo must be prefixed with `EXPO_PUBLIC_`
- Never commit your actual API key to version control
- The app includes fallback mock data when API key is not configured

## 📱 App Behavior

### With API Key Configured:
✅ Real movie data from TMDB  
✅ High-quality movie posters and images  
✅ Detailed cast and crew information  
✅ Real ratings and reviews  
✅ Up-to-date movie information  
✅ Advanced search capabilities  

### Without API Key (Fallback):
✅ Mock movie data for testing  
✅ Basic functionality works  
⚠️ Limited movie selection  
⚠️ No images or detailed information  

## 🎯 FlatList Optimizations

The app implements several FlatList performance optimizations:

### Performance Features:
- **`removeClippedSubviews`**: Removes off-screen items from memory
- **`getItemLayout`**: Pre-calculates item dimensions for better scrolling
- **`maxToRenderPerBatch`**: Controls batch rendering size
- **`windowSize`**: Optimizes viewport rendering
- **`initialNumToRender`**: Sets initial render count
- **`onEndReached`**: Implements infinite scrolling
- **`keyExtractor`**: Optimized key extraction
- **`useCallback`**: Memoized render functions

### Example Implementation:
```typescript
<FlatList
  data={movies}
  renderItem={renderMovie}
  keyExtractor={keyExtractor}
  getItemLayout={getItemLayout}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  onEndReached={handleLoadMore}
  onEndReachedThreshold={0.5}
  refreshControl={<RefreshControl />}
/>
```

## 🏗️ Project Structure

```
mobile-tab-navigator/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based screens
│   │   ├── movies/        # Movie-related screens
│   │   ├── favorites.tsx  # Favorites screen
│   │   ├── index.tsx      # Home screen
│   │   └── profile.tsx    # Profile screen
│   ├── modal.tsx          # Modal screen
│   └── _layout.tsx        # Root layout
├── services/              # API services
│   ├── config.ts          # API configuration
│   └── movieService.ts    # Movie API service
├── stores/                # State management
│   ├── useMovieStore.ts   # Movie state
│   ├── useFavoriteStore.ts # Favorites state
│   └── useUIStore.ts      # UI state
├── assets/                # Static assets
├── constants/             # App constants
└── .env                   # Environment variables
```

## 🔄 State Management

The app uses Zustand for state management with three main stores:

### Movie Store (`useMovieStore`)
- Movie search and data
- API integration
- Loading states
- Error handling

### Favorites Store (`useFavoriteStore`)
- Favorite movies management
- Persistent storage
- Favorite operations

### UI Store (`useUIStore`)
- Loading states
- Modal visibility
- Theme management
- Refresh states

## 🛡️ Error Handling

The app includes comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **API Errors**: Specific error messages for different HTTP status codes
- **Timeout Handling**: Request timeout with user feedback
- **Fallback Data**: Mock data when API is unavailable
- **User Feedback**: Clear error messages and retry options

## 🎨 UI/UX Features

- **Responsive Design**: Adapts to different screen sizes
- **Loading States**: Skeleton screens and activity indicators
- **Pull-to-Refresh**: Refresh content with pull gesture
- **Image Optimization**: Lazy loading with fallbacks
- **Smooth Animations**: Optimized transitions and interactions
- **Accessibility**: Screen reader support and proper contrast

## 🧪 Testing

### Manual Testing Checklist:
- [ ] Search functionality works
- [ ] Favorites can be added/removed
- [ ] Images load properly
- [ ] Pull-to-refresh works
- [ ] Infinite scrolling works
- [ ] Error states display correctly
- [ ] App works without API key (fallback mode)

### API Testing:
- [ ] Valid API key returns real data
- [ ] Invalid API key shows error message
- [ ] Network errors are handled gracefully
- [ ] Rate limiting is respected

## 🚨 Troubleshooting

### Common Issues:

1. **"Invalid API Key" Error**
   - Double-check your API key in `.env`
   - Ensure no extra spaces in the key
   - Verify your TMDB account is activated

2. **"Network Error"**
   - Check internet connection
   - Verify TMDB API is accessible
   - Check if you've exceeded rate limits

3. **No Movie Results**
   - Try different search terms
   - Check if the movie exists in TMDB database
   - Verify API key permissions

4. **Images Not Loading**
   - Check network connection
   - Verify image URLs are valid
   - Check if TMDB image service is available

### Debug Mode:
- Check console logs for detailed error messages
- The app automatically falls back to mock data on API errors
- Use network inspector to debug API calls

## 📊 API Limits

- **Free Tier**: 1,000 requests per day
- **Rate Limit**: 40 requests per 10 seconds
- **No credit card required** for basic usage

## 🔒 Security

- **API Key Protection**: Never commit API keys to version control
- **Environment Variables**: Use `.env` for sensitive data
- **Input Validation**: Sanitize user inputs
- **Error Handling**: Don't expose sensitive error details

## 📚 Additional Resources

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy coding! 🎉** Your movie app now has optimized API integration and high-performance FlatList implementation!