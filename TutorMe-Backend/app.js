var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var forceSSL = require('express-force-ssl');


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

var fs = require('fs');
var config = fs.readFileSync(__dirname + '/config/development.json');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var loadSecret = function(path){
  // try{
  //   return require('fs').readFileSync(path).toString();
  // } catch (e){
    return "GENERATE-A-SESSION-KEY";
  //}
};

app.use(session({
  secret : loadSecret(__dirname + '.sessionKey'),
  resave : false,
  saveUninitialized : true,
}));

var CASInstance = new CASAuthentication({
  cas_url : 'https://casdev.ad.stetson.edu/cas',
  service_url : 'https://tutorme.stetson.edu',
  cas_version :'2.0',
  renew : false,
  is_dev_mode : false,
  dev_mode_user : 'TestUser',
  session_name : 'cas_user',
  destroy_session : true,
});

app.use(forceSSL);

app.set('forceSSLOptions', {
  enable301Redirects: true,
  trustXFPHeader: false,
  httpsPort: 443,
  sslRequiredMessage: 'SSL Required.'
});

console.log(__dirname);

//router imports
var routes = require('./routes/index').init(CASInstance, database);
var students = require('./routes/students').init(CASInstance, database);
var tutors = require('./routes/tutors').init(CASInstance, database);
var sessionRoutes = require('./routes/sessions');
var appointments = require('./routes/appointments');

app.use('/', routes);
app.use('/api/students', students);
app.use('/api/tutors', tutors);
app.use('/api/sessions', sessionRoutes);
app.use('/api/appointments', appointments);

app.get('/api/authenticate', CASInstance.bounce_redirect);
app.get('/api/logout', CASInstance.logout);

/*
  permissions definition middleware
*/
var security = require('./security.js');
app.use();

app.get('/api/docs/routes', CASInstance.bounce, function(req, res){
  res.type('application/json');
  res.end(JSON.stringify(app._router.stack, null, 2));
});

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
    res.end(JSON.stringify({
      'error' : true ,
      "result" : {
        message: err.message,
        error: err
      }
    }));
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.end(JSON.stringify({
    'error' : true ,
    "result" : {
    }
  }));
});


module.exports = app;
