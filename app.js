var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);



// catch 404 errors
app.use((req, res, next) => {
  console.log('404 error handler called');
  const err = new Error('Not Found');
  err.status = 404;
  res.status(404).render('not-found', { err, title: "Not Found"});
});

// Global error handler 
app.use((err, req, res, next) => {
  if(err){
    console.log('Global error handler called', err);
  }

  if(err.status === 404) {
    res.status(404).render('not-found', {err});
  } else {
    err.message = err.message || `Oops! It looks like something went wrong on the server.`;
    res.status(err.status || 500).render('error', {err});
  }
});

module.exports = app;
