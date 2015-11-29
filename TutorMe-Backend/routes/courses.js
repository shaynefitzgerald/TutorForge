var express = require('express');

var fn_error = function(res, err){
  return res.end(JSON.stringify({
    success : false,
    error : err,
  }));
};
var fn_success = function(res, result){
  res.end(JSON.stringify({ success : true, result : result }));
};

var db_getMajorTags = function(db, callback){
  var MajorModel = db.model('MajorModel');
  MajorModel.find({}, function(err, result){
    if(err) callback(false, err);
    return callback(true, result);
  });
};

exports.init = function(cas, db){
  var router = express.Router();
  
  router.get('/getMajorTags', function(req, res){
    res.type('application/json');
    return db_getMajorTags(db, function(success, result){
      if(!success) return fn_error(res, result);
      return fn_sucess(res, result);
    });
  });

  return router;
};
