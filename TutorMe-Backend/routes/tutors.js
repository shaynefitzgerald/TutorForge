var express = require('express');

var error = function(res, err){
  return res.end(JSON.stringify({
    success : false,
    error : err,
  }));
};
var success = function(res, result){
  res.end({ success : true, result : result });
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

exports.init = function(cas, db){
  var router = express.Router();

  router.get('/get', function(req, res){
    res.type('application/json');
    var validFields = [
      "ID","Email","Subject"
    ];
    var queryRequirements = [ 'field', 'value' ];
    var query = ( url.parse( req.url ).query !== null ) ?
     querystring.parse( url.parse( req.url ).query ) : {};
     if(query[queryRequirements[0]] === undefined || query[queryRequirements[1] === undefined]){
       return error(res, "Invalid or Malformed parameters");
     }
     if(!(query.field in validFields)){
       return error(res, "Invalid Field");
     }
     return db_getTutor(db, query, function(err, result){
       if(!success) return error(res, err);
       return ;
     });

  });

  return router;
};
