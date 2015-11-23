var mongoose = require("/app/TutorMe/TutorMe-Backend/node_modules/mongoose");
var db = require('/app/TutorMe/TutorMe-Backend/db/connect.js').applicationConnection;
var fs = require('fs');

var CourseModel = db.model('CourseModel');
var Students = db.model("StudentModel");

var findElemIndex = function(arr, field, value){
  for(var x = 0; x < arr.length; x++){
    if((arr[x])[field] === value){
      return x;
    }
  } return -1;
};

CourseModel.find({}, function(err, courses){
  if(err) return callback(false, err);
  courses.forEach(function(e, i){
    Students.findOne({ID : e.StudentID}, function(err, student){
      student.Courses.push(e._id);
      var index = findElemIndex(e.Courses,StudentID,ID);
      e.Courses[index].StudentRef = student._id;
    });
  });
});
