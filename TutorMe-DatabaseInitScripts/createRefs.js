var mongoose = require("/app/TutorMe/TutorMe-Backend/node_modules/mongoose");
var db = require('/app/TutorMe/TutorMe-Backend/db/connect.js').applicationConnection;
var fs = require('fs');

var CourseModel = db.model('CourseModel');
var StudentModel = db.model("StudentModel");

var findElemIndex = function(arr, field, value){
  for(var x = 0; x < arr.length; x++){
    if((arr[x])[field] === value){
      return x;
    }
  } return -1;
};

return CourseModel.find({}, function(err, courses){
  if(err) return callback(false, err);
  return courses.forEach(function(course, courseIndex){
    return course.Students.forEach(function(student, studentIndex){
      return StudentModel.findOne({ID : student.StudentID },function(err, student){
        if(!Array.isArray(student.Courses)){
          student.Courses = [];
        }
        student.Courses.push(course._id);
        var index = findElemIndex(course.Courses , "StudentID" , ID);
        courses.Courses[index].StudentRef = student._id;
        return student.save(function(err){
          if(err) {
            console.log(err);
            process.exit(-1);
          }
          return course.save(function(err){
            if(err) {
              console.log(err);
              process.exit(-1);
            }
            return console.log("linked " + student.ID + " with course" + " CourseTitle successfully.");
          });
        });
      });
    });
  });
});
