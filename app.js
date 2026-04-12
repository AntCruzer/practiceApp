/* 
  FILE SUMAMRY...
  It imports the tools your server needs.
  It creates the Express app.
  It adds middleware, which are functions that run before your routes.
  It connects route files like / and /users.
  It exports the finished app so it can be started elsewhere. 
*/

// IMPORTS
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// CREATE EXPRESS APPLICATION
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ENABLES COMMUNICATION TO BACKEND FROM OTHER SOURCES
app.use(cors({
  origin: '*',                              // ALLOW REQUESTS FROM ANY ORIGIN (OK FOR DEVELOPMENT, NOT IDEAL FOR PRODUCTION)
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // ALLOW THESE HTTP METHODS
}));


app.use(express.static(path.join(__dirname, 'public')));

// USE THE indexRouter FOR ALL REQUESTS THAT START AT "/"
// EXAMPLE: GET /
app.use('/', indexRouter);

// USE THE usersRouter FOR ALL REQUESTS THAT START WITH "/users"
// EXAMPLE: GET /users
app.use('/users', usersRouter);

// EXPORT THE APP SO IT CAN BE USED BY ANOTHER FILE
// USUALLY THIS IS IMPORTED BY www OR SERVER STARTUP FILE
module.exports = app;



// /* MAIN SETUP FILE FOR EXPRESS SERVER
// - compiles everything all together for the app to be exported */

// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const cors = require('cors');

// // ENTITY ROUTE FILES
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// app.use(cors({
//   origin: '*', // For development, allow everyone. For Prod, restrict this.
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));

// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// module.exports = app;