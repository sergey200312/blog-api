var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();
const passport = require("./middleware/auth.js");
const helmet = require('helmet');
const RateLimit = require("express-rate-limit");


var indexRouter = require('./routes/index.js');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(helmet());

app.use('/api', indexRouter);

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

const mongoDB = process.env.MONGODB_URL
mongoose.set("strictQuery", false);

async function main() {
  try {
    await mongoose.connect(mongoDB);
    console.log("Подключено к MongoDB");
  } catch (err) {
    console.error("Ошибка подключения к MongoDB", err);
  }
}
main();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
