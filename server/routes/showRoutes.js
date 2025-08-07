import express from "express";
import { addShow, addTestMovie, getNowPlayingMovies, getShow, getShows } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get('/now-playing',protectAdmin, getNowPlayingMovies)
showRouter.post('/add', protectAdmin, addShow)
showRouter.get("/all", getShows)
showRouter.get("/:movieId", getShow)
showRouter.get('/test-data', addTestMovie);

export default showRouter;