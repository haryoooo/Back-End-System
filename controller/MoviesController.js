const db = require("../database/index");
require("dotenv").config();

class MoviesController { 
  static moviesGetAll(req, res) {
    const query = `SELECT 
                  movies.name,
                  movies.release_date,
                  movies.release_month,
                  movies.release_year,
                  movies.duration_min,
                  movies.genre,
                  movies.description,
                  movie_status.status,
                  locations.location,
                  show_times.time
                      FROM MOVIES 
                          JOIN movie_status
                                ON movies.status = movie_status.id 
                          JOIN schedules
                                ON movies.id = schedules.movie_id
                          JOIN locations
                                ON schedules.location_id = locations.id
                          JOIN show_times
                                ON schedules.time_id = show_times.id
                          ORDER BY movies.name`;

    db.query(query, (error, results) => {
      if (error) {
        res.status(500).send(error);
      }

      res.status(200).send(results);
    });
  }

  static moviesGetSpecific(req, res) {
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

    const joinAll = `SELECT
                      movies.name,
                      movies.release_date,
                      movies.release_month,
                      movies.release_year,
                      movies.duration_min,
                      movies.genre,
                      movies.description,
                      movie_status.status,
                      locations.location,
                      show_times.time
                          FROM MOVIES 
                              JOIN movie_status
                                    ON movies.status = movie_status.id 
                              JOIN schedules
                                    ON movies.id = schedules.movie_id
                              JOIN locations
                                    ON schedules.location_id = locations.id
                              JOIN show_times
                                    ON schedules.time_id = show_times.id
                                         WHERE movie_status.status=${status}
                                         AND locations.location=${location}
                                         AND show_times.time=${time}`;

    if (status && location && time) {
      db.query(joinAll, (error, results) => {
        if (error) {
          res.status(500).send(error);
          return;
        }

        if (results.length === 0) {
          res.status(404).send({ message: "Data is empty" });
          return;
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
  }

  static addMovies(req, res) {
    const {
      name,
      genre,
      release_date,
      release_month,
      release_year,
      duration_min,
      description,
    } = req.body;

    const showMovies = `SELECT * FROM movies WHERE name="${name}" `;

    const addMovies = `INSERT INTO movies 
                            (name,genre,release_date,release_month,release_year,duration_min,description)
                            VALUES ('${name}','${genre}',${release_date},${release_month},${release_year},${duration_min},'${description}')`;

    db.query(addMovies, (error, results) => {
      if (error) {
        res.status(500).send(error);
        return;
      }
    });

    db.query(showMovies, (error, results) => {
      const data = results[0];

      if (error) {
        res.status(500).send(error);
        return;
      }

      res.status(200).send({ ...data });
    });
  }

  static editMoviesSchedule(req, res) {
    const id = req.params.id;
    const { status } = req.body;
    const updateMovies = `UPDATE movies SET status=${status} WHERE id=${id}`;

    db.query(updateMovies, (error, results) => {
      if (error) {
        res.status(500).send(error);
        return;
      }

      res.status(200).send({ id: id, message: "Status has been changed" });
    });
  }

  static addMoviesSchedule(req, res) {
    const movieId = req.params.id;
    const { location_id, time_id } = req.body;

    const addSchedule = `INSERT INTO schedules (movie_id,location_id,time_id) 
                       VALUES (${movieId},${location_id},${time_id})`;

    db.query(addSchedule, (error, results) => {
      if (error) {
        res.status(500).send(error);
        return;
      }

      res.status(200).send({ id: movieId, message: "Schedule has been added" });
    });
  }
}

module.exports = MoviesController
