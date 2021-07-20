const moviesRouter = require("express").Router();
const db = require("../database");
const MoviesController = require("../controller/MoviesController")
const authentication = require("../middleware/authentication");
require("dotenv").config();

moviesRouter.get("/movies/get/all", MoviesController.moviesGetAll);

moviesRouter.get("/movies/get", MoviesController.moviesGetSpecific);

moviesRouter.post("/movies/add", authentication, MoviesController.addMovies);

moviesRouter.patch("/movies/edit/:id", authentication, MoviesController.editMoviesSchedule);

moviesRouter.patch("/movies/set/:id", authentication, MoviesController.addMoviesSchedule);

module.exports = moviesRouter;
