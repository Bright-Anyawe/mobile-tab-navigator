# 🎬 TMDB API Setup Guide

This guide will help you set up The Movie Database (TMDB) API for real movie data in your app.

## 📋 Prerequisites

1. **Create a TMDB Account**
   - Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
   - Sign up for a free account

2. **Get Your API Key**
   - Go to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Click "Create" under "Request an API Key"
   - Choose "Developer" option
   - Fill out the application form
   - Accept the terms and submit

## 🔧 Configuration

### Step 1: Add Your API Key

1. **Open** `services/config.js`
2. **Replace** `'your_tmdb_api_key_here'` with your actual API key:

```javascript
export const TMDB_CONFIG = {
  API_KEY: 'your_actual_api_key_here', // ← Replace this
  BASE_URL: 'https://api.themoviedb.org/3',
  // ... rest of config
};
```

### Step 2: Test the API

1. **Start your app**: `expo start`
2. **Search for movies** - you should now see real movie data!
3. **Check the console** for any API errors

## 🚀 Features Available

### ✅ Currently Implemented
- **Search Movies**: Real-time movie search
- **Movie Details**: Detailed information including cast, crew, ratings
- **Popular Movies**: Trending and popular movies
- **Fallback Mode**: Works with mock data if API key not configured

### 🔄 API Endpoints Used
- `/search/movie` - Search for movies
- `/movie/{id}` - Get movie details
- `/movie/popular` - Get popular movies
- `/discover/movie` - Discover movies by genre
- `/genre/movie/list` - Get movie genres

## 📱 App Behavior

### With API Key Configured:
- ✅ Real movie data from TMDB
- ✅ Movie posters and images
- ✅ Detailed cast and crew information
- ✅ Real ratings and reviews
- ✅ Up-to-date movie information

### Without API Key (Fallback):
- ✅ Mock movie data for testing
- ✅ Basic functionality works
- ⚠️ Limited movie selection
- ⚠️ No images or detailed information

## 🛠️ Troubleshooting

### Common Issues:

1. **"Invalid API Key" Error**
   - Double-check your API key in `services/config.js`
   - Make sure there are no extra spaces
   - Verify your TMDB account is activated

2. **"Network Error"**
   - Check your internet connection
   - Verify TMDB API is accessible
   - Check if you've exceeded rate limits

3. **No Movie Results**
   - Try different search terms
   - Check if the movie exists in TMDB database
   - Verify API key permissions

### Debug Mode:
- Check browser/console logs for detailed error messages
- The app will automatically fall back to mock data on API errors

## 📊 API Limits

- **Free Tier**: 1,000 requests per day
- **Rate Limit**: 40 requests per 10 seconds
- **No credit card required** for basic usage

## 🔒 Security Note

- **Never commit your API key** to version control
- Consider using environment variables for production
- The current setup is fine for development/learning

## 📚 TMDB API Documentation

For more advanced features, check out:
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [API Reference](https://developers.themoviedb.org/3/getting-started/introduction)

---

**Happy coding! 🎉** Your movie app now has access to real movie data from TMDB!