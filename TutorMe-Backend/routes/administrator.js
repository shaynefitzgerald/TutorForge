var express = require('express');
var routeSecurity = require('../security.js');
{
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
}

var db_createTutor = function(db, data, callback) {
  var TutorModel = db.model('TutorModel');
  var StudentModel = db.model('StudentModel');
  if (data.isStudentTutor) {
    StudentModel.findOne({
      ID: Number(data.ID)
    }, function(err, result) {
      if (err) callback(false, err);
      if (result === null) return callback(false, "No Such Student");
      var toAdd = {
        isStudentTutor: true,
        ID: result.ID,
        FirstName: result.FirstName,
        LastName: result.LastName,
        Email: result.Email,
        Subject: data.Subject,
        StudentRef: result._id,
        LifetimeSessionCount: 0,
        LastArchivedSession: new Date(0),
        Sessions: [],
      };
      return (new TutorModel(toAdd)).save(function(err, Tutor) {
        if (err) return callback(false, err);
        result.IsTutor = true;
        result.TutorRef = Tutor._id;
        result.save(function(err) {
          if (err) return callback(false, err);
          return callback(true, Tutor);
        });
      });
    });
  } else {
    StudentModel.findOne({
      ID: Number(data.ID)
    }, function(err, result) {
      if (result !== null) {
        data.isStudentTutor = true;
        return db_createTutor(db, data, callback);
      }
      var toAdd = {
        isStudentTutor: false,
        ID: data.ID,
        Email: data.Email,
        Subject: data.Subject,
        FirstName: data.FirstName,
        LastName: data.LastName,
        LifetimeSessionCount: 0,
        LastArchivedSession: new Date(0),
        Sessions: [],
      };
      return (new TutorModel(toAdd)).save(function(err, Tutor) {
        if (err) return callback(false, err);
        return callback(true, Tutor);
      });
    });
  }
};
var db_removeTutor = function(db, query, callback) {
  var TutorModel = db.model('TutorModel');
  return TutorModel.findOne({
    ID: Number(query.ID)
  }, function(err, result) {
    if (err) return callback(false, err);
    if (result === null) callback(false, "No Such Tutor");
    var StudentRef = result.StudentRef;
    return result.remove(function(err) {
      if (err) callback(false, err);
      if (StudentRef === undefined) {
        return callback(true);
      }
      var StudentModel = db.model('StudentModel');
      return StudentModel.findOne({
        _id: StudentRef
      }, function(err, result) {
        result.IsTutor = false;
        result.TutorRef = undefined;
        result.save(function(err, Student) {
          if (err) return callback(false, err);
          return callback(true, Student);
        });
      });
    });
  });
};

exports.init = function(cas, db) {
  var router = express.Router();

  router.post('/setAsTutor', cas.block , function(req, res) {
    res.type('application/json');
    var body = req.body;

    if(!routeSecurity.authorized(req)) return fn_error(res, "Unauthorized");

    if (!containsKeys(body, ['ID', 'Subject', 'isStudentTutor'])) {
      return fn_error(res, "Missing or Malformed Parameters");
    }
    return db_createTutor(db, body, function(success, result) {
      if (!success) return fn_error(res, result);
      return fn_success(res, result);
    });
  });
  router.post('/createNonStudentTutor', cas.block, function(req, res) {
    res.type('application/json');
    var body = req.body;
    if(!routeSecurity.authorized(req)) return fn_error(res, "Unauthorized");

    if (!containsKeys(body, ['ID', 'FirstName', 'LastName', 'Subject', 'isStudentTutor'])) {
      return fn_error(res, "Missing or Malformed Parameters");
    }
    return db_createTutor(db, body, function(success, result) {
      if (!success) return fn_error(res, result);
      return fn_success(res, result);
    });
  });
  router.post('/removeTutor', cas.block, function(req, res) {
    res.type('application/json');
    if(!routeSecurity.authorized(req)) return fn_error(res, "Unauthorized");
    var body = req.body;
    if (!containsKeys(body, ['ID'])) {
      return fn_error(res, "Missing or Malformed Parameters");
    }
    return db_removeTutor(db, body, function(success, result) {
      if (!success) return fn_error(res, result);
      return fn_success(res, result);
    });
  });

  return router;
};
