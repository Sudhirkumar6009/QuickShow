import axios from "axios"
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res)=>{
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
        })

        const movies = data.results;
        res.json({success: true, movies: movies})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to add a new show to the database
export const addShow = async (req, res) =>{
    try {
        const {movieId, showsInput, showPrice} = req.body

        let movie = await Movie.findById(movieId)

        if(!movie) {
            // Fetch movie details and credits from TMDB API
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`} }),

                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`} })
            ]);

            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditsResponse.data;

             const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
             }

             // Add movie to the database
             movie = await Movie.create(movieDetails);
        }

        const showsToCreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`;
                showsToCreate.push({
                    movie: movieId, // This should work now with the updated model
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });

        if(showsToCreate.length > 0){
            await Show.insertMany(showsToCreate);
        }

         //  Trigger Inngest event
         await inngest.send({
            name: "app/show.added",
             data: {movieTitle: movie.title}
         })

        res.json({success: true, message: 'Show Added successfully.'})
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

// API to get all shows from the database
export const getShows = async (req, res) =>{
    try {
        console.log("Fetching shows...");
        const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({ showDateTime: 1 });
        console.log(`Found ${shows.length} shows`);
        
        // If shows with valid movies exist, return them
        if (shows.length > 0 && shows[0].movie) {
            // Filter unique shows
            const uniqueShows = new Set(shows.map(show => show.movie));
            console.log(`Unique movies: ${uniqueShows.size}`);
            return res.json({success: true, shows: Array.from(uniqueShows)});
        } 
        
        // FALLBACK: Directly fetch from TMDB if no shows in database
        console.log("No shows found, fetching from TMDB API");
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
        });
        
        if (!data.results || data.results.length === 0) {
            return res.json({success: true, shows: []});
        }
        
        // Get details for each movie
        const moviePromises = data.results.slice(0, 8).map(async (movie) => {
            try {
                const [detailsRes, creditsRes] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                        headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
                    }),
                    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits`, {
                        headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
                    })
                ]);
                
                return {
                    _id: movie.id.toString(),
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path,
                    backdrop_path: movie.backdrop_path,
                    release_date: movie.release_date,
                    original_language: movie.original_language,
                    tagline: detailsRes.data.tagline || "",
                    genres: detailsRes.data.genres || [],
                    casts: creditsRes.data.cast?.slice(0, 10) || [],
                    vote_average: movie.vote_average || 0,
                    runtime: detailsRes.data.runtime || 120,
                };
            } catch (error) {
                console.error(`Error fetching details for movie ${movie.id}:`, error.message);
                return null;
            }
        });
        
        const movieDetails = (await Promise.all(moviePromises)).filter(Boolean);
        return res.json({success: true, shows: movieDetails});
        
    } catch (error) {
        console.error("Error in getShows:", error);
        res.json({ success: false, message: error.message });
    }
}

// API to get a single show from the database
export const getShow = async (req, res) =>{
    try {
        const {movieId} = req.params;
        
        // First check if the movie exists
        const movie = await Movie.findById(movieId);
        
        if (!movie) {
            console.log(`Movie with id ${movieId} not found, fetching from TMDB`);
            
            try {
                // Fetch movie details and credits from TMDB API as fallback
                const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`} 
                    }),
                    axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`} 
                    })
                ]);
                
                const movieApiData = movieDetailsResponse.data;
                const movieCreditsData = movieCreditsResponse.data;
                
                const movieDetails = {
                    _id: movieId,
                    title: movieApiData.title,
                    overview: movieApiData.overview,
                    poster_path: movieApiData.poster_path,
                    backdrop_path: movieApiData.backdrop_path,
                    genres: movieApiData.genres,
                    casts: movieCreditsData.cast,
                    release_date: movieApiData.release_date,
                    original_language: movieApiData.original_language,
                    tagline: movieApiData.tagline || "",
                    vote_average: movieApiData.vote_average,
                    runtime: movieApiData.runtime,
                };
                
                // get all upcoming shows for the movie
                const shows = await Show.find({movie: movieId, showDateTime: { $gte: new Date() }});
                
                const dateTime = {};
                
                shows.forEach((show) => {
                    const date = show.showDateTime.toISOString().split("T")[0];
                    if(!dateTime[date]){
                        dateTime[date] = [];
                    }
                    dateTime[date].push({ time: show.showDateTime, showId: show._id });
                });
                
                return res.json({success: true, movie: movieDetails, dateTime});
            } catch (error) {
                console.error(`Error fetching movie ${movieId} from TMDB:`, error.message);
                return res.json({ success: false, message: "Movie not found" });
            }
        }
        
        // get all upcoming shows for the movie
        const shows = await Show.find({movie: movieId, showDateTime: { $gte: new Date() }});
        
        const dateTime = {};
        
        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date] = [];
            }
            dateTime[date].push({ time: show.showDateTime, showId: show._id });
        });
        
        res.json({success: true, movie, dateTime});
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Temporary endpoint to add test data
export const addTestMovie = async (req, res) => {
    try {
        // Check if movies exist
        const existingMovies = await Movie.find({});
        if (existingMovies.length > 0) {
            return res.json({ success: true, message: "Movies already exist", count: existingMovies.length });
        }
        
        // Add a test movie from your dummy data
        const testMovie = {
            _id: "575265",
            title: "Mission: Impossible - The Final Reckoning",
            overview: "Ethan Hunt and team continue their search for the terrifying AI known as the Entity...",
            poster_path: "/z53D72EAOxGRqdr7KXXWp9dJiDe.jpg",
            backdrop_path: "/1p5aI299YBnqrEEvVGJERk2MXXb.jpg",
            release_date: "2025-05-17",
            original_language: "en",
            tagline: "Our lives are the sum of our choices.",
            genres: [
                { id: 28, name: "Action" },
                { id: 12, name: "Adventure" },
                { id: 53, name: "Thriller" }
            ],
            casts: [
                { name: "Tom Cruise", profile_path: "/usWnHCzbADijULREZYSJ0qfM00y.jpg" },
                { name: "Hayley Atwell", profile_path: "/zmznPrQ9GSZwcOIUT0c3GyETwrP.jpg" }
            ],
            vote_average: 7.042,
            vote_count: 19885,
            runtime: 170
        };
        
        await Movie.create(testMovie);
        
        // Create a show for this movie
        const testShow = {
            movie: "575265",
            showDateTime: new Date(Date.now() + 86400000), // tomorrow
            showPrice: 59,
            occupiedSeats: {}
        };
        
        await Show.create(testShow);
        
        return res.json({ success: true, message: "Test movie and show added!" });
    } catch (error) {
        console.error("Error adding test data:", error);
        res.json({ success: false, message: error.message });
    }
}

// Add this function
export const getDirectMovies = async (req, res) => {
    try {
        const { data } = await axios.get('https://api.themoviedb.org/3/movie/popular', {
            headers: {Authorization: `Bearer ${process.env.TMDB_API_KEY}`}
        });
        
        if (!data.results) {
            return res.json({success: false, message: "Failed to fetch movies from TMDB"});
        }
        
        const movies = data.results.map(movie => ({
            _id: movie.id.toString(),
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            release_date: movie.release_date,
            original_language: movie.original_language,
            vote_average: movie.vote_average,
            // Placeholder values for required fields
            tagline: "",
            genres: movie.genre_ids.map(id => ({ id, name: "Genre" })),
            casts: [],
            runtime: 120
        }));
        
        res.json({success: true, shows: movies});
    } catch (error) {
        console.error("Error fetching direct movies:", error);
        res.json({success: false, message: error.message});
    }
};