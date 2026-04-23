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

// const express = require('express');
// const router = express.Router();

// const movieController = require('../controllers/movieController');
// const authenticateToken = require('../middleware/auth');

// /*
//   GET /api/movies
//   GET ALL MOVIES
// */
// router.get('/', movieController.getAllMovies);

// /*
//   GET /api/movies/:id
//   GET ONE MOVIE BY LOCAL DATABASE ID
// */
// router.get('/:id', movieController.getMovieById);

// /*
//   POST /api/movies
//   CREATE A NEW MOVIE
//   PROTECTED ROUTE
// */
// router.post('/', authenticateToken, movieController.createMovie);

// /*
//   PUT /api/movies/:id
//   UPDATE A MOVIE
//   PROTECTED ROUTE
// */
// router.put('/:id', authenticateToken, movieController.updateMovie);

// module.exports = router;

// // // // IDENTIFIERS AND IMPORTS
// // // const express = require('express');
// // // const router = express.Router();
// // // const userController = require('../controllers/userController');
// // // const authenticateToken = require('../middleware/auth');


// // // module.exports = router;


// // const express = require('express');
// // const router = express.Router();

// // const movieController = require('../controllers/movieController');
// // const authenticateToken = require('../middleware/auth');

// // /*
// //   GET /movies
// //   GET ALL MOVIES
// // */
// // router.get('/', movieController.getAllMovies);

// // /*
// //   GET /movies/:id
// //   GET ONE MOVIE BY LOCAL DATABASE ID
// // */
// // router.get('/:id', movieController.getMovieById);

// // /*
// //   POST /movies
// //   CREATE A NEW MOVIE
// //   PROTECTED ROUTE
// // */
// // router.post('/', authenticateToken, movieController.createMovie);

// // /*
// //   PUT /movies/:id
// //   UPDATE A MOVIE
// //   PROTECTED ROUTE
// // */
// // router.put('/:id', authenticateToken, movieController.updateMovie);

// // /*
// //   DELETE /movies/:id
// //   DELETE A MOVIE
// //   PROTECTED ROUTE
// // */
// // router.delete('/:id', authenticateToken, movieController.deleteMovie);

// // module.exports = router;