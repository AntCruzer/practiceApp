// BUSINESS LOGIC FOR MOVIE-RELATED OPERATIONS
// LOGIC LAYER, HANDLES REQUESTS AND RESPONSES, VALIDATION

const Movie = require('../models/Movie');

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

/*
  HELPER: MAKES A REQUEST TO TMDB
*/
async function tmdbRequest(path, queryParams = {}) {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    const error = new Error('TMDB_API_KEY IS NOT CONFIGURED');
    error.status = 500;
    throw error;
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set('api_key', apiKey);

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.status_message || 'TMDB REQUEST FAILED');
    error.status = response.status;
    throw error;
  }

  return data;
}

/*
  HELPER: MAP TMDB RESPONSE DATA INTO YOUR LOCAL MOVIES TABLE SHAPE
*/
function buildLocalMovieData(tmdbMovie) {
  return {
    tmdb_id: tmdbMovie.id,
    title: tmdbMovie.title,
    release_date: tmdbMovie.release_date || null,
    poster_path: tmdbMovie.poster_path || null,
    runtime: tmdbMovie.runtime ?? null,
    last_synced_at: new Date()
  };
}

const movieController = {
  /*
    GET /api/movies
    RETRIEVES ALL CACHED MOVIES FROM THE LOCAL MOVIES TABLE
  */
  getAllMovies: async (req, res) => {
    try {
      const movies = await Movie.getAllMovies();
      console.log('**GET getAllMovies SUCCESSFUL**');
      return res.status(200).json(movies);
    } catch (err) {
      console.log('**GET getAllMovies FAILED**');
      return res.status(500).json({ error: err.message });
    }
  },

  /*
    GET /api/movies/:id
    RETRIEVES A SINGLE CACHED MOVIE BY ITS LOCAL DATABASE ID
  */
  getMovieById: async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const movie = await Movie.findById(id);

      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      console.log('**GET getMovieById SUCCESSFUL**');
      return res.status(200).json(movie);
    } catch (err) {
      console.log('**GET getMovieById FAILED**');
      return res.status(500).json({ error: err.message });
    }
  },

  /*
    POST /api/movies/import
    IMPORTS A MOVIE FROM TMDB INTO THE LOCAL MOVIES TABLE
    EXPECTS: { tmdbId: 123 } OR { tmdb_id: 123 }
  */
  importMovie: async (req, res) => {
    try {
      const tmdbId = Number(req.body.tmdbId ?? req.body.tmdb_id);
      const language = req.body.language || req.query.language || 'en-US';

      if (!tmdbId) {
        return res.status(400).json({
          error: 'tmdbId is required and must be valid'
        });
      }

      // CHECK WHETHER THE MOVIE IS ALREADY CACHED LOCALLY
      const existingMovie = await Movie.findByTmdbId(tmdbId);
      if (existingMovie) {
        return res.status(200).json({
          message: 'Movie already exists in local cache',
          movie: existingMovie
        });
      }

      // FETCH FRESH MOVIE DETAILS FROM TMDB
      const tmdbMovie = await tmdbRequest(`/movie/${tmdbId}`, { language });
      const localMovieData = buildLocalMovieData(tmdbMovie);

      // SAVE THE MOVIE INTO THE LOCAL DATABASE
      const newId = await Movie.create(
        localMovieData.tmdb_id,
        localMovieData.title,
        localMovieData.release_date,
        localMovieData.poster_path,
        localMovieData.runtime,
        localMovieData.last_synced_at
      );

      const createdMovie = await Movie.findById(newId);

      console.log('**POST importMovie SUCCESSFUL**');
      return res.status(201).json({
        message: 'Movie imported and cached successfully',
        movie: createdMovie
      });
    } catch (err) {
      console.log('**POST importMovie FAILED**');

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Movie already exists in local cache' });
      }

      return res.status(err.status || 500).json({ error: err.message });
    }
  },

  /*
    PUT /api/movies/:id/refresh
    RE-FETCHES TMDB DATA AND UPDATES THE LOCAL CACHE RECORD
  */
  refreshMovie: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const language = req.body.language || req.query.language || 'en-US';

      if (!id) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      // MAKE SURE THE LOCAL MOVIE EXISTS FIRST
      const existingMovie = await Movie.findById(id);
      if (!existingMovie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      // FETCH THE LATEST DETAILS FROM TMDB USING THE STORED TMDB ID
      const tmdbMovie = await tmdbRequest(`/movie/${existingMovie.tmdb_id}`, { language });
      const updates = buildLocalMovieData(tmdbMovie);

      await Movie.updateById(id, updates);

      const refreshedMovie = await Movie.findById(id);

      console.log('**PUT refreshMovie SUCCESSFUL**');
      return res.status(200).json({
        message: 'Movie refreshed from TMDB successfully',
        movie: refreshedMovie
      });
    } catch (err) {
      console.log('**PUT refreshMovie FAILED**');

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Duplicate TMDB ID' });
      }

      return res.status(err.status || 500).json({ error: err.message });
    }
  }
};

module.exports = movieController;


// // BUSINESS LOGIC FOR MOVIE-RELATED OPERATIONS
// // LOGIC LAYER, HANDLES REQUESTS AND RESPONSES, VALIDATION

// const Movie = require('../models/Movie');

// const movieController = {
//   /*
//     GET /movies
//     RETRIEVES ALL MOVIES FROM THE MOVIES TABLE
//   */
//   getAllMovies: async (req, res) => {
//     try {
//       const movies = await Movie.getAllMovies();
//       console.log('**GET getAllMovies SUCCESSFUL**');
//       return res.status(200).json(movies);
//     } catch (err) {
//       console.log('**GET getAllMovies FAILED**');
//       return res.status(500).json({ error: err.message });
//     }
//   },

//   /*
//     GET /movies/:id
//     RETRIEVES A SINGLE MOVIE BY ITS LOCAL DATABASE ID
//   */
//   getMovieById: async (req, res) => {
//     try {
//       const id = Number(req.params.id);

//       if (!id) {
//         return res.status(400).json({ error: 'Invalid ID' });
//       }

//       const movie = await Movie.findById(id);

//       if (!movie) {
//         return res.status(404).json({ error: 'Movie not found' });
//       }

//       console.log('**GET getMovieById SUCCESSFUL**');
//       return res.status(200).json(movie);
//     } catch (err) {
//       console.log('**GET getMovieById FAILED**');
//       return res.status(500).json({ error: err.message });
//     }
//   },

//   /*
//     POST /movies
//     CREATES A NEW MOVIE RECORD IN THE DATABASE
//   */
//   createMovie: async (req, res) => {
//     try {
//       const {
//         tmdb_id,
//         title,
//         release_date,
//         poster_path,
//         runtime,
//         last_synced_at
//       } = req.body;

//       // REQUIRED FIELD CHECKS
//       if (!tmdb_id || !title) {
//         return res.status(400).json({
//           error: 'tmdb_id and title are required'
//         });
//       }

//       // PREVENT DUPLICATE TMDB MOVIE RECORDS
//       const existingMovie = await Movie.findByTmdbId(tmdb_id);
//       if (existingMovie) {
//         return res.status(409).json({
//           error: 'Movie with this TMDB ID already exists',
//           id: existingMovie.id
//         });
//       }

//       const newId = await Movie.create(
//         tmdb_id,
//         title,
//         release_date || null,
//         poster_path || null,
//         runtime || null,
//         last_synced_at || null
//       );

//       console.log('**POST createMovie SUCCESSFUL**');
//       return res.status(201).json({
//         message: 'Movie created',
//         id: newId
//       });
//     } catch (err) {
//       console.log('**POST createMovie FAILED**');

//       if (err.code === 'ER_DUP_ENTRY') {
//         return res.status(409).json({ error: 'Duplicate movie entry' });
//       }

//       return res.status(500).json({ error: err.message });
//     }
//   },

//   /*
//     PUT /movies/:id
//     UPDATES AN EXISTING MOVIE RECORD
//   */
//   updateMovie: async (req, res) => {
//     try {
//       const id = Number(req.params.id);

//       if (!id) {
//         return res.status(400).json({ error: 'Invalid ID' });
//       }

//       const {
//         tmdb_id,
//         title,
//         release_date,
//         poster_path,
//         runtime,
//         last_synced_at
//       } = req.body;

//       // BUILD UPDATES OBJECT
//       const updates = {};

//       if (tmdb_id !== undefined) updates.tmdb_id = tmdb_id;
//       if (title !== undefined) updates.title = title;
//       if (release_date !== undefined) updates.release_date = release_date;
//       if (poster_path !== undefined) updates.poster_path = poster_path;
//       if (runtime !== undefined) updates.runtime = runtime;
//       if (last_synced_at !== undefined) updates.last_synced_at = last_synced_at;

//       if (Object.keys(updates).length === 0) {
//         return res.status(400).json({
//           error: 'Provide at least one field to update'
//         });
//       }

//       const affected = await Movie.updateById(id, updates);

//       if (affected === 0) {
//         return res.status(404).json({
//           error: 'Movie not found (or nothing changed)'
//         });
//       }

//       console.log('**PUT updateMovie SUCCESSFUL**');
//       return res.status(200).json({
//         message: 'Movie updated',
//         id
//       });
//     } catch (err) {
//       console.log('**PUT updateMovie FAILED**');

//       if (err.code === 'ER_DUP_ENTRY') {
//         return res.status(409).json({ error: 'Duplicate TMDB ID' });
//       }

//       return res.status(500).json({ error: err.message });
//     }
//   },

//   /*
//     DELETE /movies/:id
//     DELETES A MOVIE RECORD BY ITS LOCAL DATABASE ID
//   */
//   deleteMovie: async (req, res) => {
//     try {
//       const id = Number(req.params.id);

//       if (!id) {
//         return res.status(400).json({ error: 'Invalid ID' });
//       }

//       const affected = await Movie.deleteById(id);

//       if (affected === 0) {
//         return res.status(404).json({ error: 'Movie not found' });
//       }

//       console.log('**DELETE deleteMovie SUCCESSFUL**');
//       return res.status(200).json({
//         message: 'Movie deleted',
//         id
//       });
//     } catch (err) {
//       console.log('**DELETE deleteMovie FAILED**');
//       return res.status(500).json({ error: err.message });
//     }
//   }
// };

// module.exports = movieController;