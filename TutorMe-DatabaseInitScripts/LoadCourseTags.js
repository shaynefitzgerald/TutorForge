var mongoose = require("/app/TutorMe/TutorMe-Backend/node_modules/mongoose");
var db = require('/app/TutorMe/TutorMe-Backend/db/connect.js').applicationConnection;
var fs = require('fs');
var Majors = fs.readFileSync('./courses.txt');

Majors.toString().split('\n').forEach(function(e){
  (new (db.model('MajorModel'))({
    MajorSubject : e
  })).save(function(err){
    if(err){
      console.log(err);
      process.exit(-1);
    }
    console.log(e);
  });
});
