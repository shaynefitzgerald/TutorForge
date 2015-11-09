var mongoose = require('mongoose');
var fs = require('fs');
var schema = require('./schema/index').dir;
var config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json'));
var db_Connection = mongoose.connect("mongodb://@localhost:27017/test?poolSize=10");
db_Connection.on('error', console.error.bind(console, 'connection error:'));

var studentJsonArray = [];

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

//Loads studentcut.json into an Array of JSON obejcts
var dat = fs.readFileSync('/import/json/coursescut.json', 'utf8')
studentJsonArray = JSON.parse(dat);


//Loads student model for DB
var Student = db.model('StudentModel');

/*
  Loop through array of JSON objects and create a database model,
  then adds the model to the DB
*/
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
