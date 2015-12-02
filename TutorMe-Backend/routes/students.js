var express = require('express');
var url = require('url');
var querystring = require('querystring');
var router = express.Router();

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
var toEmail = function(name) {
  var concat = "@((?:[a-z][a-z\\.\\d\\-]+)\\.(?:[a-z][a-z\\-]+))(?![\\w\\.])";
  return new RegExp(name + concat);
};

var db_isTutor = function(db, studentID, callback) {
  var Student = db.model('StudentModel');
  Student.findOne({
    'ID': Number(studentID)
  }, function(err, res) {
    if (err) callback(false, err);
    if (res !== undefined && res !== null) {
      return callback(true, res.isTutor);
    } else {
      return callback(false, "No Such User");
    }
  });
};
var db_getStudent = function(db, field, value, callback) {
  var Student = db.model('StudentModel');
  var queryObject = {};
  if (field !== "Username") {
    queryObject[field] = value;
  } else {
    Student.find({
      Email: {
        $regex: toEmail(value)
      }
    }, function(err, res) {
      if (err) return callback(false, err);
      return callback(true, res);
    });
  }
  Student.find(queryObject, function(err, res) {
    if (err) return callback(false, err);
    return callback(true, res);
  });
};
var db_getStudentCourses = function(db, studentID, callback) {
  var Student = db.model('StudentModel');

  return Student.findOne({
      'Students': {
        ID : Student,
      }
    }).populate('Courses')
    .exec(function(err, result) {
      if (err) return callback(false, err);
      return callback(true, result.Courses);
    });
};
var db_getStudentProfessors = function(db, studentID, callback) {
  var Courses = db.model('CourseModel');

  return Courses.find({
      'Students': {
        $elemMatch: {
          ID: Number(studentID)
        }
      }
    },
    function(err, result) {
      if (err) return callback(false, err);
      var ret = [];
      for(var i = 0; i < result.length; i++){
        if (containsKeys(e, ['InstructorFirstName', "InstructorLastName", "InstructorEmail"]))
          ret.push({
            "InstructorFirstName": e.InstructorFirstName,
            "InstructorLastName": e.InstructorLastName,
            "InstructorEmail": e.InstructorEmail,
          });
      }
      return callback(true, ret);
    });
};


exports.init = function(cas, db) {
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
  router.get('/isTutor', function(req, res, next) {
    res.type('application/json');
    var query = (url.parse(req.url).query !== null) ?
      querystring.parse(url.parse(req.url).query) : {};

    if (query.StudentID === undefined)
      return res.end(JSON.stringify({
        success: false,
        error: "No StudentID provided"
      }));

    return db_isTutor(db, Number(query.StudentID),
      function(success, result) {
        if (!success) {
          return res.end(JSON.stringify({
            success: false,
            error: result
          }));
        } else {
          return res.end(JSON.stringify({
            success: true,
            result: result
          }));
        }
      });
  });
  /*
    gets all professors of courses the student is registered by banner as a student.
    @param StudentID : Number //Student ID
    @returns {
      success : Boolean,
      //if error,
      error : String
      //if success,
      result : [Object]
    }
  */
  router.get('/getStudentProfessors', function(req, res, next) {
    res.type('application/json');
    var StudentID;
    var query = (url.parse(req.url).query !== null) ?
      querystring.parse(url.parse(req.url).query) : {};
    try {
      StudentID = Number(query.StudentID);
      if (Number.isNaN(StudentID))
        throw new Error();
    } catch (e) {
      return res.end(JSON.stringify({
        success: false,
        error: "Invalid StudentID formatting",
      }));
    }
    return db_getStudentCourses(db, StudentID, function(success, result) {
      if (!success) {
        return res.end(JSON.stringify({
          success: false,
          error: result,
        }));
      } else {
        return res.end(JSON.stringify({
          success: true,
          result: result,
        }));
      }
    });
  });
  /*
    gets all courses the student is registered by banner as a student.
    @param StudentID : Number //Student ID
    @returns {
      success : Boolean,
      //if error,
      error : String
      //if success,
      result : [Object]
    }
  */
  router.get('/getStudentCourses', function(req, res, next) {
    res.type('application/json');
    var StudentID;
    var query = (url.parse(req.url).query !== null) ?
      querystring.parse(url.parse(req.url).query) : {};
    try {
      StudentID = Number(query.StudentID);
    } catch (e) {
      return res.end(JSON.stringify({
        success: false,
        error: "Invalid StudentID formatting",
      }));
    }
    return db_getStudentCourses(db, StudentID, function(success, result) {
      if (!success) {
        return res.end(JSON.stringify({
          success: false,
          error: result,
        }));
      } else {
        return res.end(JSON.stringify({
          success: true,
          result: result,
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
  router.get('/get', function(req, res, next) {
    res.type('application/json');
    var validFields = [
      "ID", "OtherID", "FirstName", "LastName", "FullName", "Email", "Username", "IsTutor"
    ];
    var queryRequirements = ['field', 'value'];
    var query = (url.parse(req.url).query !== null) ?
      querystring.parse(url.parse(req.url).query) : {};
    if (query[queryRequirements[0]] === undefined || query[queryRequirements[1]] === undefined) {
      return res.end(JSON.stringify({
        success: false,
        error: "Missing or malformed parameters"
      }));
    }
    if (validFields.indexOf(query.field) < 0) {
      return res.end(JSON.stringify({
        success: false,
        error: "Invalid Field"
      }));
    } else if (query.value === "") {
      //XXX:Maybe change to allow for empty searches?
      return res.end(JSON.stringify({
        success: false,
        error: "Empty Search Values are not allowed."
      }));
    } else {
      return db_getStudent(db, query.field, query.value,
        function(success, result) {
          if (success) {
            return res.end(JSON.stringify({
              success: true,
              "result": result
            }));
          } else {
            return res.end(JSON.stringify({
              success: false,
              error: result
            }));
          }
        });
    }
  });
  return router;
};
