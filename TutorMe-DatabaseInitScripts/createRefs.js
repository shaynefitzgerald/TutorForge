var mongoose = require("/app/TutorMe/TutorMe-Backend/node_modules/mongoose");
var db = require('/app/TutorMe/TutorMe-Backend/db/connect.js').applicationConnection;
var fs = require('fs');

var CourseModel = db.model('CourseModel');
var StudentModel = db.model("StudentModel");

var linkage = function(course){
  return function(err, result){
    if(result.Courses === undefined)
      result.Courses = [];
    result.Courses.push(course);
    return result.save(function(err){
      if(err){ console.error(err); return process.exit(-1); }
    });
  };
};

CourseModel.find({}, function(err, courses){
  if(err){ console.error(err); return process.exit(-1); }
  for(var x = 0; x < courses.length; x++){
    for(var si = 0; si < courses[x].Students.length; si++){
      StudentModel.find({ ID : courses[x].Students[si].StudentID }, linkage(courses[x]._id) );
    }
  }
});
