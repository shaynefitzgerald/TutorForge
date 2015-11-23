var mongoose = require("/app/TutorMe/TutorMe-Backend/node_modules/mongoose");
// var config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json'));
var db = require('/app/TutorMe/TutorMe-Backend/db/connect.js').applicationConnection;
// db_Connection.on('error', console.error.bind(console, 'connection error:'));
var fs = require('fs');

/*
 * Create 4 arrays for storing data
*/
var coursesJsonArray = [];
var remadeCourse = [];
var studentArray = [];
var CourseNames = [];

/*
 * Read unparsed courses json file
 */

var dat = fs.readFileSync('/import/json/coursescut.json', 'utf8');
coursesJsonArray = JSON.parse(dat);

/*
  Function for looping through the json array and determining if the Course title exist
*/

var checkForCourse = function(titl){
  for (var i = 0; i < CourseNames.length; i++){
    if (CourseNames[i] === titl){
      return true;
    }
  }
  return false;
};

/*
 * For each json object in the array check to see if its course has been saved
 * if not create a new json object for the course keyed by its course title
 */
coursesJsonArray.forEach(function(json){
  var title = json.CourseTitle;
  var inArray = checkForCourse(title);

  if (!inArray){
    studentArray = [];
    CourseNames.push(title);
    studentArray.push({StudentRef: undefined , StudentID : json.StudentID});
    var newcourse = {};
     newcourse = {
      Students : studentArray,
      InstructorLastName : json.InstructorLastName,
      InstructorFirstName : json.InstructorFirstName,
      InstructorEmail : json.InstructorEmail,
      CourseSubject : json.CourseSubject,
      CourseSection : json.CourseSection,
      CourseTitle : json.CourseTitle,
      Term : json.Term,
    };
    remadeCourse.push(newcourse);
    inArray = false;
  }
  else {
    var ctitle = json.CourseTitle;
    for (var x = 0; x < remadeCourse.length; x++){
      var vtitle = remadeCourse[x].CourseTitle;
      if (ctitle === vtitle){
        remadeCourse[x].Students.push({StudentRef: undefined , StudentID : json.StudentID});
      }
    }
  }
});

/*
  Converts array into a JSON object then saves into courses.json
*/

// var coursejson = JSON.stringify(remadeCourse, null, '\t');
// fs.writeFile("/import/parsed/courses.json",coursejson, function(err){
//   if (err) throw err;
//   console.log('It is saved');
// });

var Course = db.model('CourseModel');

remadeCourse.forEach(function(course){
  var courseToAdd = new Course({
    Students : course.Students,
    InstructorLastName : course.InstructorLastName,
    InstructorFirstName : course.InstructorFirstName,
    InstructorEmail : course.InstructorEmail,
    CourseSubject : course.CourseSubject,
    CourseSection : course.CourseSection,
    CourseTitle : course.CourseTitle,
    Term : course.Term,
  });

  courseToAdd.save(function(err){
    if (err) console.log(err);
    console.log("Success");
  });
});
