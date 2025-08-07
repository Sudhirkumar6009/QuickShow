import express from "express";
import { addShow, addTestMovie, getDirectMovies, getNowPlayingMovies, getShow, getShows } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing', protectAdmin, getNowPlayingMovies);
showRouter.post('/add', protectAdmin, addShow);
showRouter.get("/all", getShows);
showRouter.get("/direct-movies", getDirectMovies); // Add this route
showRouter.get("/:movieId", getShow);
showRouter.get('/test-data', addTestMovie);

export default showRouter;