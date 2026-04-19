// BUSINESS LOGIC FOR WATCHLIST-RELATED OPERATIONS
// LOGIC LAYER, HANDLES REQUESTS AND RESPONSES, VALIDATION

const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');

/* HELPER: CONVERTS COMMON INPUTS INTO TRUE/FALSE
   ACCEPTS BOOLEAN, 1/0, "1"/"0", "true"/"false" */
function normalizeBoolean(value) {
  if (value === true || value === 1 || value === '1' || value === 'true') {
    return true;
  }

  if (value === false || value === 0 || value === '0' || value === 'false') {
    return false;
  }

  return value;
}

const watchlistController = {
  /*
    GET /watchlist
    GETS ALL WATCHLIST ENTRIES FOR THE CURRENT LOGGED-IN USER
  */
  getMyWatchlist: async (req, res) => {
    try {
      const userId = Number(req.user.id);

      const watchlist = await Watchlist.getAllByUserId(userId);
      console.log('**GET getMyWatchlist SUCCESSFUL**');

      return res.status(200).json(watchlist);
    } catch (err) {
      console.log('**GET getMyWatchlist FAILED**');
      return res.status(500).json({ error: err.message });
    }
  },

  /*
    POST /watchlist
    FOLLOWS A MOVIE FOR THE CURRENT LOGGED-IN USER
    EXPECTS A LOCAL movie_id FROM THE MOVIES TABLE
  */
  followMovie: async (req, res) => {
    try {
      const userId = Number(req.user.id);

      const {
        movie_id,
        region,
        platform,
        remind_on_sale,
        remind_on_release,
        ticket_on_sale_date_override
      } = req.body;

      const movieId = Number(movie_id);

      if (!movieId) {
        return res.status(400).json({ error: 'movie_id is required and must be valid' });
      }

      // MAKE SURE THE MOVIE EXISTS IN THE LOCAL MOVIES TABLE
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found in local database' });
      }

      // PREVENT DUPLICATE FOLLOWS
      const existingEntry = await Watchlist.findByUserAndMovie(userId, movieId);
      if (existingEntry) {
        return res.status(409).json({
          error: 'Movie is already in your watchlist',
          id: existingEntry.id
        });
      }

      const newId = await Watchlist.create(
        userId,
        movieId,
        region ?? null,
        platform ?? null,
        normalizeBoolean(remind_on_sale) ?? false,
        normalizeBoolean(remind_on_release) ?? false,
        ticket_on_sale_date_override ?? null
      );

      console.log('**POST followMovie SUCCESSFUL**');
      return res.status(201).json({
        message: 'Movie added to watchlist',
        id: newId
      });
    } catch (err) {
      console.log('**POST followMovie FAILED**');

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Movie is already in your watchlist' });
      }

      return res.status(500).json({ error: err.message });
    }
  },

  /*
    PUT /watchlist/:id
    UPDATES A WATCHLIST ENTRY FOR THE CURRENT LOGGED-IN USER
    ONLY ALLOWS USER-SPECIFIC PREFERENCE FIELDS TO BE UPDATED
  */
  updateWatchlistEntry: async (req, res) => {
    try {
      const watchlistId = Number(req.params.id);
      const userId = Number(req.user.id);

      if (!watchlistId) {
        return res.status(400).json({ error: 'Invalid watchlist ID' });
      }

      // MAKE SURE THE WATCHLIST ENTRY EXISTS
      const existingEntry = await Watchlist.findById(watchlistId);
      if (!existingEntry) {
        return res.status(404).json({ error: 'Watchlist entry not found' });
      }

      // MAKE SURE THE ENTRY BELONGS TO THE LOGGED-IN USER
      if (Number(existingEntry.user_id) !== userId) {
        return res.status(403).json({
          error: 'Forbidden: You can only update your own watchlist entries'
        });
      }

      const {
        region,
        platform,
        remind_on_sale,
        remind_on_release,
        ticket_on_sale_date_override
      } = req.body;

      const updates = {};

      if (region !== undefined) updates.region = region;
      if (platform !== undefined) updates.platform = platform;
      if (remind_on_sale !== undefined) {
        updates.remind_on_sale = normalizeBoolean(remind_on_sale);
      }
      if (remind_on_release !== undefined) {
        updates.remind_on_release = normalizeBoolean(remind_on_release);
      }
      if (ticket_on_sale_date_override !== undefined) {
        updates.ticket_on_sale_date_override = ticket_on_sale_date_override;
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          error: 'Provide at least one field to update'
        });
      }

      const affected = await Watchlist.updateById(watchlistId, updates);

      if (affected === 0) {
        return res.status(404).json({
          error: 'Watchlist entry not found (or nothing changed)'
        });
      }

      console.log('**PUT updateWatchlistEntry SUCCESSFUL**');
      return res.status(200).json({
        message: 'Watchlist entry updated',
        id: watchlistId
      });
    } catch (err) {
      console.log('**PUT updateWatchlistEntry FAILED**');
      return res.status(500).json({ error: err.message });
    }
  },

  /*
    DELETE /watchlist/:id
    REMOVES A WATCHLIST ENTRY FOR THE CURRENT LOGGED-IN USER
  */
  deleteWatchlistEntry: async (req, res) => {
    try {
      const watchlistId = Number(req.params.id);
      const userId = Number(req.user.id);

      if (!watchlistId) {
        return res.status(400).json({ error: 'Invalid watchlist ID' });
      }

      // MAKE SURE THE WATCHLIST ENTRY EXISTS
      const existingEntry = await Watchlist.findById(watchlistId);
      if (!existingEntry) {
        return res.status(404).json({ error: 'Watchlist entry not found' });
      }

      // MAKE SURE THE ENTRY BELONGS TO THE LOGGED-IN USER
      if (Number(existingEntry.user_id) !== userId) {
        return res.status(403).json({
          error: 'Forbidden: You can only delete your own watchlist entries'
        });
      }

      const affected = await Watchlist.deleteById(watchlistId);

      if (affected === 0) {
        return res.status(404).json({ error: 'Watchlist entry not found' });
      }

      console.log('**DELETE deleteWatchlistEntry SUCCESSFUL**');
      return res.status(200).json({
        message: 'Watchlist entry deleted',
        id: watchlistId
      });
    } catch (err) {
      console.log('**DELETE deleteWatchlistEntry FAILED**');
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = watchlistController;