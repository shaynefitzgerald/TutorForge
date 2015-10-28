var express = require('express');
var router = express.Router();

var db_isTutor = function(db, studentID, callback){
  var Student = db.model('StudentModel');
  if(typeof studentID !== "number")
    return callback(false, 'Invalid StudentID');

  Student.findOne({'StudentID' : studentID}, function(err, res){
    if(err) callback(false, err);
    if(res !== undefined){
      return callback(true, res.isTutor);
    }  else {
      return callback(false, "No Such User");
    }
  });
};
var db_getStudent = function(db, field, value, callback){
  var Student = db.model('StudentModel');
  var queryObject = {};
  queryObject[field] = value;
  Student.find(queryObject, function(err, res){
    if(err) return callback(false, err);
    return callback(true, res);
  });
};


exports.init = function(cas, db){
    /*
      gets if a student is registered as a tutor.
      @param StudentID : Number //(800 number)
      @returns {
        success : Boolean,
        //if error
        error : String,
        //if succeeded
        result : Boolean,
      }
    */
    router.get('/isTutor', cas.block, function(req, res, next){
      res.responseType('application/json');
      var query = ( url.parse( req.url ).query !== undefined ) ?
        querystring.parse( url.parse( req.url ).query ) : {};

      if(query.StudentID === undefined)
        return res.end(JSON.stringify({
          success : false,
          error : "No StudentID provided"
        }));

      return db_isTutor(db, Number(query.StudentID),
        function(success, result){
          if(!success){
            return res.end(JSON.stringify({
              success : false,
              error : res
            }));
          } else {
            return res.end(JSON.stringify({
              success : true,
              result : result
            }));
          }
        });
    });
    /*
      gets a student record by a field specified by the client.
      @param field : String // Field to search by
      @param value : String // value to search by
      @returns {
        success : Boolean,
        //if error,
        error : String,
        //if success,
        result : [Object],
      }
    */
    router.get('/get', cas.block, function(req, res, next){
    res.responseType("application/json");
    var validFields = [
      "ID","OtherID","FirstName","LastName","FullName","Email"
    ];
    //FIXME: change to req.body format
    var query = ( url.parse( req.url ).query !== undefined ) ?
      querystring.parse( url.parse( req.url ).query ) : {};
    if(!(query.field in validFields)){
      return res.end(JSON.stringify({
        success : false,
        error : "Invalid Field"
      }));
    } else if(query.value === ""){
      //XXX:Maybe change to allow for empty searches?
      return res.end(JSON.stringify({
          success : false,
          error : "Empty Search Values are not allowed."
      }));
    } else {
      return db_getStudent(db, query.field, query.value,
      function(success, result){
        if(success){
          return res.end(JSON.stringify({
            success : true,
            "result" : result
          }));
        } else {
          return res.end(JSON.stringify({
            success : false,
            error : result
          }));
        }
      });
    }
  });
  return router;
};
