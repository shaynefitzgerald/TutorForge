var mongoose = require("/app/TutorMe/TutorMe-Backend/node_modules/mongoose");
// var config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json'));
var db = require('/app/TutorMe/TutorMe-Backend/db/connect.js');
// db_Connection.on('error', console.error.bind(console, 'connection error:'));
var fs = require('fs');

/*
  Two arrays for storing data
*/
var studentJsonArray = [];
var remadeStudents = [];

//Loads studentcut.json into an Array of JSON obejcts
var dat = fs.readFileSync('/import/json/studentscut.json', 'utf8');
studentJsonArray = JSON.parse(dat);

//Load student model
//var StudentModel = mongoose.model('StudentModel', schema[StudentSchema]);
var Student = db.model('StudentModel');

//Loops through array of JSON obejcts and adds each one
studentJsonArray.forEach(function(json){
  // var newstudent = {};
  // newstudent = {
  //   ID : json.ID,
  //   OtherID : json.OtherID,
  //   LastName : json.LastName,
  //   FirstName : json.FirstName,
  //   FullName : json.FullName,
  //   Gender : json.Gender,
  //   Major : json.Major,
  //   Email : json.Email,
  //   Courses : [],
  //   Sessions : [],
  //   IsTutor : false,
  //   TutorRef : {},
  //   LastSubmittedFeedback : Date,
  // };
  // remadeStudents.push(newstudent);
  var studentAdd = new Student({
    ID : json.ID,
    OtherID : json.OtherID,
    LastName : json.LastName,
    FirstName : json.FirstName,
    FullName : json.FullName,
    Gender : json.Gender,
    Major : json.Major,
    Email : json.Email,
  });

// var studentsjson = JSON.stringify(remadeStudents, null, '\t');
// fs.writeFile("/import/parsed/students.json", studentsjson, function(err){
//   if (err) throw err;
//   console.log('It is saved');
// });

  studentAdd.save(function(err){
    if (err) return callback(err,false);
    return callback(null,true);
  });
});
