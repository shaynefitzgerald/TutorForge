var express = require('express');
var url = require('url');
var querystring = require('querystring');
var containsKeys = function(a, b) {
  var ret = true;
  for (var x = 0; x < b.length; x++) {
    if (!(a.hasOwnProperty(b[x]))) {
      ret = false;
    }
  }
  return ret;
};
var containsAtLeastOne = function(a, b) {
  var ret = false;
  for (var x = 0; x < b.length; x++) {
    if ((a.hasOwnProperty(b[x]))) {
      ret = true;
    }
  }
  return ret;
};
var contains = function(v, arr) {
  for (var x = 0; x < arr.length; x++) {
    if (arr[x] === v)
      return true;
  }
  return false;
};
var fn_error = function(res, err) {
  return res.end(JSON.stringify({
    success: false,
    error: err,
  }));
};
var fn_success = function(res, result) {
  res.end(JSON.stringify({
    success: true,
    result: result
  }));
};
var toEmail = function(name) {
  var concat = "@((?:[a-z][a-z\\.\\d\\-]+)\\.(?:[a-z][a-z\\-]+))(?![\\w\\.])";
  return new RegExp(name + concat);
};

var containsSchedule = function(Schedule, day, toFind){
  if(toFind.Start === undefined || toFind.End === undefined)
    return false;
  if(Schedule[day] === undefined || !Array.isArray(Schedule[day]))
    return false;
  for(var i = 0; i < Schedule[day].length; i++){
    if(Schedule[day].Start.getTime() === toFind.Start.getTime()){
      if(Schedule[day].End.getTime() === toFind.End.getTime()){
        return true;
      }
    }
  }
  return false;
};
var findScheduleIndex = function(Schedule, day, toFind){
  if(toFind.Start === undefined || toFind.End === undefined)
    return -1;
  if(Schedule[day] === undefined || !Array.isArray(Schedule[day]))
    return -1;
  for(var i = 0; i < Schedule[day].length; i++){
    if(Schedule[day].Start.getTime() === toFind.Start.getTime()){
      if(Schedule[day].End.getTime() === toFind.End.getTime()){
        return i;
      }
    }
  }
  return -1;
};

var db_getTutor = function(db, query, callback) {
  var TutorModel = db.model('TutorModel');
  var queryObject = {};
  if (query.field !== "Username") {
    queryObject[query.field] = query.value;
  } else {
    query.field = 'Email';
    query.value = { $regex : toEmail(query.value)};
  }
  return TutorModel.find(queryObject).populate('Sessions').exec(function(err, result) {
    if (err) return callback(false, err);
    return callback(true, result);
  });
};
var db_getAllTutors = function(db, query, callback) {
  var TutorModel = db.model('TutorModel');
  return TutorModel.find({
    subject: query
  }, function(err, result) {
    if (err) return callback(false, err);
    return callback(true, result);
  });
};
var db_getSchedule = function(db, query, callback){
  var TutorModel = db.model('TutorModel');
  var queryObject = {};
  if (query.field !== "Username") {
    queryObject[query.field] = query.value;
  } else {
    query.field = 'Email';
    query.value = { $regex : toEmail(query.value)};
  }
  return TutorModel.findOne(queryObject).exec(function(err, result) {
    if (err) return callback(false, err);
    return callback(true, result !== null ? result.Schedule : "No Such Tutor.");
  });
};
var db_updateSchedule = function(db, query, callback){
  var TutorModel = db.model('TutorModel');
  var queryObject = {};
  if (query.field !== "Username") {
    queryObject[query.field] = query.value;
  } else {
    query.field = 'Email';
    query.value = { $regex : toEmail(query.value)};
  }
  return TutorModel.findOne(queryObject).exec(function(err, result) {
    if (err) return callback(false, err);
    if(result === undefined || result === null)
      return callback(false, 'No Such Tutor');
    if(result.Schedule === null || result.Schedule === undefined){
      return db_createSchedule(db, query, callback);
    } else {
      var ret = result.Schedule;
      var updatedDays = Object.keys(query.Schedule);
      for(var x = 0; x < updatedDays.length; x++){
        if(result.Schedule[updatedDays[x]] === undefined){
          ret[updatedDays[x]] = query.Schedule[updatedDays[x]];
          continue;
        }
        for(var y = 0; y < query.Schedule[updatedDays[x]].length; y++){
          var candidate = query.Schedule[updatedDays[x]][y];
          if(!containsSchedule(result.Schedule, updatedDays[x], candidate)){
            ret[updatedDays[x]].push( candidate );
          }
        }
      }
      return TutorModel.update({_id : result._id}, { Schedule : ret }, function(err, result){
        if(err) return callback(false, err);
        return callback(true);
      });
    }
  });
};
var db_createSchedule = function(db, query, callback){
  var TutorModel = db.model('TutorModel');
  var queryObject = {};
  if (query.field !== "Username") {
    queryObject[query.field] = query.value;
  } else {
    query.field = 'Email';
    query.value = { $regex : toEmail(query.value)};
  }
  return TutorModel.update({_id : result._id},{Schedule : query.Schedule},function(err, result){
    if(err) return callback(false, err);
    if(result < 1) return callback(false, 'No Such Tutor');
    return callback(true);
  });
};
exports.init = function(cas, db) {
  var router = express.Router();
  router.get('/getAll', function(req, res) {
    res.type('application/json');
    var query = (url.parse(req.url).query !== null) ?
      querystring.parse(url.parse(req.url).query) : {};
    var subject = query.subject;
    return db_getAllTutors(db, subject, function(success, result) {
      if (!success) return fn_error(res, result);
      return fn_success(res, result);
    });
  });
  router.get('/get', function(req, res) {
    res.type('application/json');
    var validFields = ["ID", "Email", "Subject", "Username"];
    var queryRequirements = ['field', 'value'];
    var query = (url.parse(req.url).query !== null) ?
      querystring.parse(url.parse(req.url).query) : {};
    if (query[queryRequirements[0]] === undefined || query[queryRequirements[1] === undefined]) {
      return fn_error(res, "Invalid or Malformed parameters");
    }
    // console.log(query.field);
    if (validFields.indexOf(query.field) < 0) {
      return fn_error(res, "Invalid Field");
    }
    return db_getTutor(db, query, function(success, result) {
      if (!success) return fn_error(res, result);
      return fn_success(res, result);
    });
  });
  router.post('/createSchedule', function(req, res){
    res.type('application/json');
    var body = req.body;
    var validScheduleFields = ['M','T','W','R','F','S','U'];
    var queryRequirements = ['field', 'value'];
    if (query[queryRequirements[0]] === undefined || query[queryRequirements[1] === undefined]) {
      return fn_error(res, "Invalid or Malformed parameters");
    }
    if (validFields.indexOf(query.field) < 0) {
      return fn_error(res, "Invalid Field");
    }
    if(containsAtLeastOne(body.Schedule, validScheduleFields)){
      return db_updateSchedule(db, body, function(success, result){
        if (!success) return fn_error(res, result);
        return fn_success(res, result);
      });
    } else {
      return fn_error(res, 'Invalid or Missing Schedule Fields');
    }
  });
  router.post('/updateSchedule', function(req, res){
    res.type('application/json');
    var body = req.body;
    var validScheduleFields = ['M','T','W','R','F','S','U'];
    var queryRequirements = ['field', 'value'];
    if (query[queryRequirements[0]] === undefined || query[queryRequirements[1] === undefined]) {
      return fn_error(res, "Invalid or Malformed parameters");
    }
    if (validFields.indexOf(query.field) < 0) {
      return fn_error(res, "Invalid Field");
    }
    if(containsAtLeastOne(body.Schedule, validScheduleFields)){
      return db_updateSchedule(db, body, function(success, result){
        if (!success) return fn_error(res, result);
        return fn_success(res, result);
      });
    } else {
      return fn_error(res, 'Invalid or Missing Schedule Fields');
    }
  });
  router.get('/getSchedule', function(req, res){
    res.type('application/json');
    var validFields = ["ID", "Email", "Username"];
    var queryRequirements = ['field', 'value'];
    var query = (url.parse(req.url).query !== null) ?
      querystring.parse(url.parse(req.url).query) : {};
    if (query[queryRequirements[0]] === undefined || query[queryRequirements[1] === undefined]) {
      return fn_error(res, "Invalid or Malformed parameters");
    }
    if (validFields.indexOf(query.field) < 0) {
      return fn_error(res, "Invalid Field");
    }
    return db_getSchedule(db, query, function(success, result){
      if (!success) return fn_error(res, result);
      return fn_success(res, result);
    });
  });
  return router;
};
