require('dotenv').config();

/* 
  FILE SUMMARY...
  IT IMPORTS THE TOOLS YOUR SERVER NEEDS.
  IT CREATES THE EXPRESS APP.
  IT ADDS MIDDLEWARE, WHICH ARE FUNCTIONS THAT RUN BEFORE YOUR ROUTES.
  IT CONNECTS ROUTE FILES LIKE /, /api/auth, /api/users, /api/movies,
  /api/watchlist, AND /api/tmdb.
  IT EXPORTS THE FINISHED APP SO IT CAN BE STARTED ELSEWHERE.
*/

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const watchlistRouter = require('./routes/watchlist');
const tmdbRouter = require('./routes/tmdb');

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// MIDDLEWARE
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS MUST BE SET BEFORE ROUTES
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/tmdb', tmdbRouter);

module.exports = app;
