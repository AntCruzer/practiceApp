const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');
const authenticateToken = require('../middleware/auth');

/*
  GET /api/movies
  GET ALL CACHED MOVIES
*/
router.get('/', movieController.getAllMovies);

/*
  GET /api/movies/:id
  GET ONE CACHED MOVIE BY LOCAL DATABASE ID
*/
router.get('/:id', movieController.getMovieById);

/*
  POST /api/movies/import
  IMPORT A MOVIE FROM TMDB INTO THE LOCAL CACHE
  PROTECTED ROUTE
*/
router.post('/import', authenticateToken, movieController.importMovie);

/*
  PUT /api/movies/:id/refresh
  REFRESH A CACHED MOVIE FROM TMDB
  PROTECTED ROUTE
*/
router.put('/:id/refresh', authenticateToken, movieController.refreshMovie);

module.exports = router;