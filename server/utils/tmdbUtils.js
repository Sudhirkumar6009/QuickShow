import axios from 'axios';

// TMDB API helper functions
export const fetchTMDBData = async (endpoint, params = {}) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3${endpoint}`, {
            headers: { 
                Authorization: `Bearer ${process.env.TMDB_API_KEY}` 
            },
            params
        });
        
        return { success: true, data: response.data };
    } catch (error) {
        console.error(`Error fetching from TMDB (${endpoint}):`, error.message);
        return { success: false, error: error.message };
    }
};

// Get now playing movies
export const getNowPlayingMovies = async (page = 1) => {
    return await fetchTMDBData('/movie/now_playing', { page });
};

// Get movie details
export const getMovieDetails = async (movieId) => {
    return await fetchTMDBData(`/movie/${movieId}`);
};

// Get movie credits
export const getMovieCredits = async (movieId) => {
    return await fetchTMDBData(`/movie/${movieId}/credits`);
};

// Get popular movies
export const getPopularMovies = async (page = 1) => {
    return await fetchTMDBData('/movie/popular', { page });
};

// Search movies
export const searchMovies = async (query, page = 1) => {
    return await fetchTMDBData('/search/movie', { query, page });
};