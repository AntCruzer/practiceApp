// // IDENTIFIERS AND IMPORTS
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');
// const authenticateToken = require('../middleware/auth');


// module.exports = router;


const express = require('express');
const router = express.Router();

const movieController = require('../controllers/movieController');
const authenticateToken = require('../middleware/auth');

/*
  GET /movies
  GET ALL MOVIES
*/
router.get('/', movieController.getAllMovies);

/*
  GET /movies/:id
  GET ONE MOVIE BY LOCAL DATABASE ID
*/
router.get('/:id', movieController.getMovieById);

/*
  POST /movies
  CREATE A NEW MOVIE
  PROTECTED ROUTE
*/
router.post('/', authenticateToken, movieController.createMovie);

/*
  PUT /movies/:id
  UPDATE A MOVIE
  PROTECTED ROUTE
*/
router.put('/:id', authenticateToken, movieController.updateMovie);

/*
  DELETE /movies/:id
  DELETE A MOVIE
  PROTECTED ROUTE
*/
router.delete('/:id', authenticateToken, movieController.deleteMovie);

module.exports = router;