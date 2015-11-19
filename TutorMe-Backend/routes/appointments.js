var express = require('express');

var AppointmentRequestModel;

var db_getAppointmentRequests_Students = function(db, query, callback){
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
        if(err) return fn_error(res, err);
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
           if(err) return fn_err(res, err);
           return fn_success(res, result);
         });
       } else if(query.as === "Tutor"){
         return db_getAppointmentRequests_Tutors(db, query.Username, function(err, result){
           if(err) return fn_err(res, err);
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

     if(query.Reference !== undefined){
       
     } else {
       return fn_error(res, "Invalid or Missing Fields");
     }

  });
  router.post('/withdrawRequest',  function(req, res){
    res.end();
  });

  return router;
};
