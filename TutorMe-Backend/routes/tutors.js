var express = require('express');
var url = require('url');
var querystring = require('querystring');



var fn_error = function(res, err){
  return res.end(JSON.stringify({
    success : false,
    error : err,
  }));
};
var fn_success = function(res, result){
  res.end(JSON.stringify({ success : true, result : result }));
};

var db_getTutor = function(db, query, callback){
  var TutorModel = db.model('TutorModel');
  var queryObject = {};
  queryObject[query.field] = query.value;
  TutorModel.find(queryObject).populate('Sessions').exec(function(err, result){
    if(err) return callback(false, err);
    return callback(true, result);
  });
};
var db_getAllTutors = function(db, query, callback){
  
};

exports.init = function(cas, db){
  var router = express.Router();
  router.get('/getAll', function(req, res){
    res.type('application/json');
    return db_getAllTutors()
  });
  router.get('/get', function(req, res){
    res.type('application/json');
    var validFields = [
      "ID","Email","Subject","Username"
    ];
    var queryRequirements = [ 'field', 'value' ];
    var query = ( url.parse( req.url ).query !== null ) ?
     querystring.parse( url.parse( req.url ).query ) : {};
     if(query[queryRequirements[0]] === undefined || query[queryRequirements[1] === undefined]){
       return error(res, "Invalid or Malformed parameters");
     }
     console.log(query.field);
     if(validFields.indexOf(query.field) < 0){
       return fn_error(res, "Invalid Field");
     }
     return db_getTutor(db, query, function(success, result){
       if(!success) return fn_error(res, err);
       return fn_success(res, result);
     });

  });

  return router;
};
