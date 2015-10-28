var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//CAS Imports
var CASAuthentication = require('cas-authentication');
var session = require('express-session');

var app = express();

var database = require('./db/connect').applicationConnection;

//XXX: We probably won't need views since data population occurs async
//verify this with Brandon

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var loadSecret = function(path){
  try{
    return require('fs').readFileSync(path);
  } catch (e){
    return "GENERATE-A-SESSION-KEY";
  }
};

app.use(session({
  secret : loadSecret(__dirname + '.sessionKey'),
  resave : false,
  saveUninitialized : true,
}));

var CASInstance = new CASAuthentication({
  cas_url : 'https://casdev.ad.stetson.edu/cas',
  service_url : 'https://tutorme.ad.stetson.edu',
  renew : true,
  is_dev_mode : true,
  dev_mode_user : 'TestUser',
  session_name : 'cas_user',
  destroy_session : true,
});

//router imports
var routes = require('./routes/index').init(CASInstance, database);
var users = require('./routes/users').init(CASInstance, database);

app.use('/api/', routes);
app.use('/api/users', users);

app.get('/api/authenticate', cas.bounce_redirect);
app.get('/api/logout', CASInstance.logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
