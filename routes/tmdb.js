const express = require('express');
const router = express.Router();

const tmdbController = require('../controllers/tmdbController');

/*
  GET /api/tmdb/search?query=...
  SEARCH TMDB FOR MOVIES
*/
router.get('/search', tmdbController.searchMovies);

/*
  GET /api/tmdb/movie/:tmdbId
  GET DETAILS FOR A SINGLE TMDB MOVIE
*/
router.get('/movie/:tmdbId', tmdbController.getMovieDetails);

/*
  GET /api/tmdb/upcoming
  GET UPCOMING MOVIES FROM TMDB
*/
router.get('/upcoming', tmdbController.getUpcomingMovies);

module.exports = router;