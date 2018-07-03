"use strict";

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const reload = require('reload');
const watch = require('watch');
const flash = require('connect-flash');
const session = require('express-session');

const config = require('./config');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
require('./lib/hbs/xif');
require('./lib/hbs/sections');
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'node_modules/mdi')));


app.use(session({ secret: 'supersecretpassword'}));
app.use(flash());

let reloader = reload(app);

watch.watchTree(config.slPath, function (f, curr, prev) {
	reloader.reload();
});

require('./routes')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Page Not Found');
  err.status = 404;
  res.status(404);
  res.locals.message = err.message
  res.render('404', {title: err.status});
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: "Error: " + err.status});
});

module.exports = app;
