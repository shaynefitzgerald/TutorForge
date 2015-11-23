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

var db_getAppointmentRequests_Students = function(db, query, callback){
  var AppointmentRequestModel = db.model('AppointmentRequestModel');
  var StudentModel = db.model('StudentModel');
  StudentModel.findOne({'Username' : query }, function(err, student){
    if(err) return callback(false, err);
    if(student === undefined){
      return callback(false, "No Such User");
    } else {
      return AppointmentRequestModel.find({ Student : student._id }, function(err, appointments){
        if(err) return callback(false, err);

        return callback(true, appointments);
      });
    }
  });
};
var db_getAppointmentRequests_Tutors = function(db, query, callback){
  var AppointmentRequestModel = db.model('AppointmentRequestModel');
  var TutorModel = db.model('TutorModel');
  TutorModel.findOne({'Username' : query}, function(err, tutor){
    if(err) return callback(false, err);
    if(tutor === undefined || tutor === null){
      return callback(false, "No Such User");
    }
    return AppointmentRequestModel.find({Tutor : tutor._id}, function(err, appointments){
      if(err) return callback(false, err);

      return callback(true, appointments);
    });
  });
};

var db_makeRequest = function(db, query, callback){
  var ToAdd = {};
  var StudentModel = db.model('StudentModel');
  var StudentQuery = {};
  StudentQuery[query.StudentField] = query.Student;
  StudentModel.findOne(StudentQuery, function(err, result){
    if(err) return callback(false, err);
    if(result === null || result === undefined){
      return callback(false, "No Such Student");
    } else {
      ToAdd.Student = result._id;
      var TutorModel = db.model('TutorModel');
      var TutorQuery = {};
      TutorQuery[query.TutorField] = query.Tutor;
      TutorModel.findOne(TutorQuery, function(err, result){
        if(err) return callback(false, err);
        if(result === null || result === undefined){
          return callback(false, "No Such Student");
        } else {
          ToAdd.Tutor = result._id;
          ToAdd.RequestedStart = query.RequestedStart;
          ToAdd.Location = query.Location;
          ToAdd.Subject = query.Subject;
          var AppointmentRequestModel = db.model('AppointmentRequestModel');
          var ToSave = new AppointmentRequestModel(ToAdd);
          ToSave.save(function(err){
            if(err) return callback(false, err);
            return callback(true);
          });
        }
      });
    }
  });
};

var db_validateTutor = function(db, username, reference, callback){
  var TutorModel = db.model('TutorModel');
  var AppointmentRequestModel = db.model('AppointmentRequestModel');
  TutorModel.findOne({
    Email : toEmail(username)
  }).exec(function(err, result){
    if(err) return callback(false, err);
    if(result === undefined || result === null){
      return callback(true, false);
    } else {
      return AppointmentRequestModel.findOne({ _id : reference }, function(err, appointment){
        if(err) return callback(false, err);
        if(appointment === undefined || appointment === null){
          return callback(true, false);
        } else {
          return callback(true, appointment.Tutor = result._id);
        }
      });
    }
  });
};
var db_validateStudent = function(db, username, reference, callback){
  var StudentModel = db.model('StudentModel');
  var AppointmentRequestModel = db.model('AppointmentRequestModel');
  StudentModel.findOne({
    Email : toEmail(username)
  }).exec(function(err, result){
    if(err) return callback(false, err);
    if(result === undefined || result === null){
      return callback(true, false);
    } else {
      return AppointmentRequestModel.findOne({ _id : reference }, function(err, appointment){
        if(err) return callback(false, err);
        if(appointment === undefined || appointment === null){
          return callback(true, false);
        } else {
          return callback(true, appointment.Tutor = result._id);
        }
      });
    }
  });
};
var db_respondToRequest = function(db, reference, response, callback){
  var AppointmentRequestModel = db.model('AppointmentRequestModel');
  AppointmentRequestModel.findOne({ _id : reference }, function(err, result){
    if(err) return callback(false, err);
    if(result === undefined || result === null){
      return callback(false, "No such Request by reference: " + reference);
    } else {
      if(response === true){
        result.Responded = true;
        result.ResponseRejected = false;
        return result.save(function(err){
          if(err) return callback(false, err);
          return callback(true);
        });
      } else {
        result.Responded = true;
        result.ResponseRejected = true;
        return result.save(function(err){
          if(err) return callback(false, err);
          return callback(true);
        });
      }
    }
  });
};

exports.init = function(cas, db){
  var router = express.Router();

  AppointmentRequestModel = db.model('AppointmentRequestModel');

  router.post('/makeRequest', function(req, res){
    res.type('application/json');
    var query = req.body;
    var validKeys = ['Student', 'StudentField', 'TutorField', 'Tutor',
    'RequestedStart', 'Location', 'Subject'];
    if(containsKeys(query, validKeys)){
      return db_makeRequest(db, query, function(err, result){
        if(err) return fn_error(res, result);
        return fn_success(res);
      });
    } else {
      return fn_error(res, "Invalid or Missing Fields");
    }
  });

  /*
    call
    {
      as : <"Student" or "Tutor">
      Username : String
    },

    on success:
    {
      success : true,
      result : [
        {
          AppointmentSchema
        }
      ]
    }
  */
  router.get('/getAppointmentRequests', function(req, res){
    res.type('application/json');
    var query = ( url.parse( req.url ).query !== null ) ?
     querystring.parse( url.parse( req.url ).query ) : {};

     if(query.as !== undefined && query.Username !== undefined){
       if(query.as === "Student"){
         return db_getAppointmentRequests_Students(db, query.Username, function(err, result){
           if(err) return fn_error(res, result);
           return fn_success(res, result);
         });
       } else if(query.as === "Tutor"){
         return db_getAppointmentRequests_Tutors(db, query.Username, function(err, result){
           if(err) return fn_error(res, result);
           return fn_success(res, result);
         });
       } else {
         return fn_error(res, "Invalid or Missing Fields.");
       }
     } else {
       return fn_error(res, "Invalid or Missing Fields.");
     }
  });

  router.post('/respondToRequest',  function(req, res){
    res.type('application/json');
    var query = ( url.parse( req.url ).query !== null ) ?
     querystring.parse( url.parse( req.url ).query ) : {};
     if(query.Reference === undefined){
       return fn_error(res, "Invalid or Missing Fields");
     } else {
       if(req.session.cas_user === undefined || req.session.cas_user === ""){
        return fn_error(res, "Unauthenticated, please login");
      } else {
        return db_validateTutor(db, req.session.cas_user, query.Reference, function(success, result){
          if(!success) return fn_error(res, result);
          if(result === true){
            return db_respondToRequest(db, query.Reference, query.Response, function(success, result){
              if(!success) return fn_error(res, result);
              return fn_success(res);
            });
          } else {
            return fn_error(res, "No such Request under the username " + req.session.cas_user);
          }
        });
      }
     }
  });
  router.post('/withdrawRequest',  function(req, res){
    res.type('application/json');
    var query = ( url.parse( req.url ).query !== null ) ?
     querystring.parse( url.parse( req.url ).query ) : {};
     if(query.Reference === undefined){
       return fn_error(res, "Invalid or Missing Fields");
     } else {
       if(req.session.cas_user === undefined || req.session.cas_user === ""){
        return fn_error(res, "Unauthenticated, please login");
      } else {
        return db_validateStudent(db, req.session.cas_user, query.Reference, function(success, result){
          if(!success) return fn_error(res, result);
          else if(success && result){
            return db_withdrawRequest(db, query.Reference, function(success, result){
              if(!success) return fn_error(res, result);
              return fn_success(res);
            });
          } else {
            return fn_error(res, "No such Request with Reference: " + query.Reference);
          }
        });
      }
    }
  });

  return router;
};
