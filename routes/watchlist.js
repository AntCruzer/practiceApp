const express = require('express');
const router = express.Router();

const watchlistController = require('../controllers/watchlistController');
const authenticateToken = require('../middleware/auth');

/*
  GET /api/watchlist
  GET ALL WATCHLIST ENTRIES FOR THE LOGGED-IN USER
  PROTECTED ROUTE
*/
router.get('/', authenticateToken, watchlistController.getMyWatchlist);

/*
  POST /api/watchlist
  FOLLOW A MOVIE
  PROTECTED ROUTE
*/
router.post('/', authenticateToken, watchlistController.followMovie);

/*
  PUT /api/watchlist/:id
  UPDATE A WATCHLIST ENTRY
  PROTECTED ROUTE
*/
router.put('/:id', authenticateToken, watchlistController.updateWatchlistEntry);

/*
  DELETE /api/watchlist/:id
  REMOVE A WATCHLIST ENTRY
  PROTECTED ROUTE
*/
router.delete('/:id', authenticateToken, watchlistController.deleteWatchlistEntry);

module.exports = router;
