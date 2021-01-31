var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


const Sequelize = require('sequelize');

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
app.use('/users', usersRouter);


const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'library.db'
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();


// catch 404 errors
app.use((req, res, next) => {
  console.log('404 error handler called');

  res.status(404).render('not-found', {title: "Not Found"});
});

// Global error handler 
app.use((err, req, res, next) => {
  if(err){
    console.log('Global error handler called', err);
  }

  if(err.status === 404) {
    res.status(404).render('error', {err});
  } else {
    err.message = err.message || `Oops! It looks like something went wrong on the server.`;
    res.status(err.status || 500).render('error', {err});
  }
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
