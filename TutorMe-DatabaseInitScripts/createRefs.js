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

var operation = function(err, student){
  if(!Array.isArray(student.Courses)){
    student.Courses = [];
  }

  //Find all courses student is in
  var unlinkedCourses = CourseModel.find( {Students : student.ID} );
  console.log(unlinkedCourses);

  //Loop through unlinkedCourses to link Student to courses and visa verca

  // unlinkedCourses.forEach(function(course){
  //   student.Courses.push(course._id);
  //   var index = findElemIndex(course.Students , "StudentID" , student.ID);
  //   if(index === -1){
  //     return;
  //   }
  //   course.Students[index].StudentRef = student._id;
  //   course.save(function(err){
  //     if(err) {
  //       console.log(err);
  //       process.exit(-1);
  //     }
  //     console.log("linked " + student.ID + " with course successfully.");
  //   });
  // });
  //
  // return student.save(function(err){
  //   if(err) {
  //     console.log(err);
  //     process.exit(-1);
  //   }
  // });

};

return CourseModel.find({}, function(err, courses){
  if(err) return callback(false, err);
  for(var ci = 0; ci < courses.length; ci++){
    for(var si = 0; si < courses[ci].Students.length; si++){
      StudentModel.findOne({ID : courses[ci].Students[si].StudentID }, operation);
    }
  }
});
