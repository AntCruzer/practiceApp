// BUSINESS LOGIC FOR TMDB PROXY OPERATIONS
// KEEPS THE TMDB API KEY ON THE SERVER SIDE

// const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
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

const tmdbController = {
  /*
    GET /tmdb/search?query=...
    SEARCHES TMDB FOR MOVIES
  */
  searchMovies: async (req, res) => {
    try {
      const { query, page, language, include_adult } = req.query;

      if (!query || !query.trim()) {
        return res.status(400).json({ error: 'query IS REQUIRED' });
      }

      const data = await tmdbRequest('/search/movie', {
        query: query.trim(),
        page: page || 1,
        language: language || 'en-US',
        include_adult: include_adult || false
      });

      const results = (data.results || []).map((movie) => ({
        tmdb_id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        overview: movie.overview,
        original_language: movie.original_language,
        popularity: movie.popularity,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        adult: movie.adult
      }));

      console.log('**GET searchMovies SUCCESSFUL**');
      return res.status(200).json({
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
        results
      });
    } catch (err) {
      console.log('**GET searchMovies FAILED**');
      return res.status(err.status || 500).json({ error: err.message });
    }
  },

  /*
    GET /tmdb/movie/:tmdbId
    GETS DETAILS FOR A SINGLE TMDB MOVIE
    USEFUL FOR IMPORTING A MOVIE INTO YOUR LOCAL MOVIES TABLE
  */
  getMovieDetails: async (req, res) => {
    try {
      const tmdbId = Number(req.params.tmdbId);

      if (!tmdbId) {
        return res.status(400).json({ error: 'INVALID TMDB ID' });
      }

      const data = await tmdbRequest(`/movie/${tmdbId}`, {
        language: req.query.language || 'en-US'
      });

      console.log('**GET getMovieDetails SUCCESSFUL**');
      return res.status(200).json({
        tmdb_id: data.id,
        title: data.title,
        release_date: data.release_date,
        poster_path: data.poster_path,
        runtime: data.runtime,
        overview: data.overview,
        genres: data.genres,
        original_language: data.original_language,
        popularity: data.popularity,
        vote_average: data.vote_average,
        vote_count: data.vote_count,
        status: data.status
      });
    } catch (err) {
      console.log('**GET getMovieDetails FAILED**');
      return res.status(err.status || 500).json({ error: err.message });
    }
  },

  /*
    GET /tmdb/upcoming
    OPTIONAL HELPER FOR AN UPCOMING VIEW
  */
  getUpcomingMovies: async (req, res) => {
    try {
      const data = await tmdbRequest('/movie/upcoming', {
        page: req.query.page || 1,
        language: req.query.language || 'en-US',
        region: req.query.region
      });

      const results = (data.results || []).map((movie) => ({
        tmdb_id: movie.id,
        title: movie.title,
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        overview: movie.overview,
        original_language: movie.original_language,
        popularity: movie.popularity,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        adult: movie.adult
      }));

      console.log('**GET getUpcomingMovies SUCCESSFUL**');
      return res.status(200).json({
        dates: data.dates,
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
        results
      });
    } catch (err) {
      console.log('**GET getUpcomingMovies FAILED**');
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
};

module.exports = tmdbController;