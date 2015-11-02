var mongoose = require('mongoose');
var fs = require('fs');
var schema = require('./schema/index').dir;
var config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json'));
var db_Connection = mongoose.connect(config.ApplicationURI);
//db_Connection.on('error', console.error.bind(console, 'connection error:'));

var studentJsonArray;
var coursesJsonArray;

/* :TODO Loop through directory
var jsonfiles;
fs.reddir('/import/json', function (err, files) {
    if (err) throw err;
    jsonfiles = files;
 });

jsonfiles.forEach(function(file){
    if file.toString
});
*/

//Loads coursescut.json and studentcut.json into an Array of JSON obejcts
fs.readFile('/import/studentcut.json', 'utf8', function (err, data) {
  if (err) throw err;
  studentJsonArray = JSON.parse(data);
});

fs.readFile('/import/coursescut.json', 'utf8', function (err, data) {
  if (err) throw err;
  coursesJsonArray = JSON.parse(data);
});

//Load students and courses model
var Student = db.model('StudentModel');
var Courses = db.model('CoursesModel');

//Loops through array of JSON obejcts and adds each one
studentJsonArray.forEach(function(json){
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

  studentAdd.save(function(err){
    if (err) return callback(err,false);
    return callback(null,true);
  });

});
//:TODO Modify courses and add them to DB
