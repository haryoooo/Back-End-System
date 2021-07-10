const moviesRouter = require("express").Router();
const db = require("../database");
const authentication = require("../middleware/authentication");
require("dotenv").config();

moviesRouter.get("/movies/get/all", authentication, (req, res) => {
  const query = `SELECT * FROM MOVIES 
                    JOIN movie_status
                        ON movies.status = movie_status.id 
                    JOIN locations
                        ON movies.status = locations.id
                    JOIN show_times
                        ON movies.status = show_times.id
                            ORDER BY movie_status.id`;

  db.query(query, (error, results) => {
    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send(results);
  });
});

moviesRouter.get("/movies/get", authentication, (req, res) => {
  const status = req.query.status;
  const location = req.query.location;
  const time = req.query.time;

  const statusMovie = `SELECT * FROM movies 
                        inner join movie_status
    			        ON movies.status = movie_status.id
    				    WHERE movie_status.status=${status}`;

  const locationMovie = `SELECT * FROM movies 
                        inner join locations
    			        ON movies.status = locations.id
    				    WHERE locations.location=${location}`;

  const timeMovie = `SELECT * FROM movies 
                        inner join show_times
    			        ON movies.status = show_times.id
    				    WHERE show_times.time=${time}`;

  const joinAll = `SELECT * FROM movies 
                        JOIN movie_status
                            ON movies.status = movie_status.id
                        JOIN locations
                            ON movies.status = locations.id
                        JOIN show_times
                            ON movies.status = show_times.id
                                WHERE movie_status.status=${status}
                                AND locations.location=${location}
                                AND show_times.time=${time}`;

  if (status && location && time) {
    db.query(joinAll, (error, results) => {
      if (error) {
        res.status(500).send(error);
        return
      }

      if(results.length === 0){
        res.status(404).send({message: "Data is empty"})
        return
      }

      res.status(200).send(results);
    });
    return;
  }

  if (status) {
    db.query(statusMovie, (error, results) => {
      if (error) {
        res.status(500).send(error);
      }

      res.status(200).send(results);
    });
    return;
  }

  if (location) {
    db.query(locationMovie, (error, results) => {
      if (error) {
        res.status(500).send(error);
      }

      res.status(200).send(results);
    });
    return;
  }

  if (time) {
    db.query(timeMovie, (error, results) => {
      if (error) {
        res.status(500).send(error);
      }

      res.status(200).send(results);
    });
    return;
  }
});

module.exports = moviesRouter;
