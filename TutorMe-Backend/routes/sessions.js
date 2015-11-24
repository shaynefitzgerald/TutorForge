var express = require('express');

var containsKeys = function ( a, b ) {
  var ret = true;
  for ( var x = 0; x < b.length; x++ ) {
    if ( !( a.hasOwnProperty( b[ x ] ) ) ) {
      ret = false;
    }
  }
  return ret;
};
var containsAtLeastOne = function ( a, b ) {
  var ret = false;
  for ( var x = 0; x < b.length; x++ ) {
    if ( ( a.hasOwnProperty( b[ x ] ) ) ) {
      ret = true;
    }
  }
  return ret;
};
var contains = function(v, arr){
  for(var x = 0; x < arr.length; x++){
    if(arr[x] === v)
      return true;
  } return false;
};
var fn_error = function(res, err){
  return res.end(JSON.stringify({
    success : false,
    error : err,
  }));
};
var fn_success = function(res, result){
  res.end(JSON.stringify({ success : true, result : result }));
};
var toEmail = function(name){
  var concat = "@((?:[a-z][a-z\\.\\d\\-]+)\\.(?:[a-z][a-z\\-]+))(?![\\w\\.])";
  return new RegExp(name + concat);
};

var db_getScheduledSessions = function(db, by, value, callback){
  var AppointmentRequestModel = db.model('AppointmentRequestModel');
  var TutorModel = db.model('TutorModel');
  var query = {}; query[by] = value;
  TutorModel.findOne(query, function(err, result){
    if(err) return callback(false, err);
    if(result === undefined || result === null) return callback(false, 'No Such Tutor');
    return AppointmentRequestModel.find({Tutor : result._id, Start : { $gte : new Date() }})
    .populate('Student').populate('Tutor').populate('ForClass')
    .exec(function(err, appointments){
      if(err) return callback(false, err);
      return callback(true, appointments);
    });
  });
};
var db_getPreviousSessions = function(db, by, value, callback){
  var AppointmentRequestModel = db.model('AppointmentRequestModel');
  var TutorModel = db.model('TutorModel');
  var query = {}; query[by] = value;
  TutorModel.findOne(query, function(err, result){
    if(err) return callback(false, err);
    if(result === undefined || result === null) return callback(false, 'No Such Tutor');
    return AppointmentRequestModel.find({Tutor : result._id, Start : { $lte : new Date() }})
    .populate('Student').populate('Tutor').populate('ForClass')
    .exec(function(err, appointments){
      if(err) return callback(false, err);
      return callback(true, appointments);
    });
  });
};
var db_endSession = function(db, sessionData, callback){
  var SessionModel = db.model("SessionModel");
  SessionModel.findOne({_id : sessionData._id}).populate('Student').populate('Tutor')
  .exec();
};
exports.init = function(cas, db){
  var router = express.Router();

  router.post('/endSession',  function(req, res){
    res.end();
  });
  router.get('/getPreviousSessions',  function(req, res){
    res.type('application/json');
    var query = ( url.parse( req.url ).query !== null ) ?
     querystring.parse( url.parse( req.url ).query ) : {};
    if(containsKeys(query, ['by', 'value'])){
      return db_getPreviousSessions(db, query.by, query.value, function(success, result) {
        if(!success) return fn_error(res, result);
        return fn_success(res, result);
      });
    } else {
      return fn_error(res, "Invalid or Malformed Fields");
    }
  });
  router.get('/getScheduledSessions', function(req, res){
    res.type('application/json');
    var query = ( url.parse( req.url ).query !== null ) ?
     querystring.parse( url.parse( req.url ).query ) : {};
    if(containsKeys(query, ['by', 'value'])){
      return db_getScheduledSessions(db, query.by, query.value, function(success, result) {
        if(!success) return fn_error(res, result);
        return fn_success(res, result);
      });
    } else {
      return fn_error(res, "Invalid or Malformed Fields");
    }
  });

  return router;
};
