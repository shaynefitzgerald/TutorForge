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
    studentArray.push(json.StudentID);
    var newcourse = {};
     newcourse[json.CourseTitle] = {
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
      var vtitle = remadeCourse[x].[CourseTitle];
      console.log(vtitle);
      if (ctitle === vtitle){
        console.log("IF");
        //remadeCourse[x].Students.push(json.StudentID);
      }
    }
    //console.log(ctitle);
  }
});

/*
  Converts array into a JSON object then saves itto courses.json
*/
var coursejson = JSON.stringify(remadeCourse, null, '\t');
fs.writeFile("/import/courses.json",coursejson, function(err){
  if (err) throw err;
  console.log('It is saved');
});
