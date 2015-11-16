var express = require('express');

var AppointmentRequestModel;

var db_getAppointmentRequests_Students = function(db, query, callback){
  var StudentModel = db.model('StudentModel');
  StudentModel.findOne({'Username' : query.Username }, function(err, student){
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
  TutorModel.findOne({'Username' : query.Username }, function(err, tutor){
    if(err) return callback(false, err);

    return AppointmentRequestModel.find({Tutor : tutor._id}, function(err, appointments){
      if(err) return callback(false, err);

      return callback(true, appointments);
    });
  });
};
var db_getAppointmentRequests_Administrators = function(db, query, callback){
  var AdministratorModel = db.model('AdministratorModel');
  return AppointmentRequestModel.find(query, function(err, appointments){
    if(err) return callback(false, err);

    return callback(true, appointments);
  });
};


exports.init = function(cas, db){
  var router = express.Router();

  AppointmentRequestModel = db.model('AppointmentRequestModel');

  router.post('/makeRequest', function(req, res){

  });
  router.get('/getAppointmentRequests', function(req, res){
    res.type('application/json');
    var query = ( url.parse( req.url ).query !== null ) ?
     querystring.parse( url.parse( req.url ).query ) : {};
    res.end();
  });

  router.post('/respondToRequest',  function(req, res){
    res.end();
  });
  router.post('/withdrawRequest',  function(req, res){
    res.end();
  });

  return router;
};
