var fs = require('fs');

var coursesJsonArray = [];
var remadeCourse = [];
var studentArray = [];

var dat = fs.readFileSync('/import/json/coursescut.json', 'utf8')
coursesJsonArray = JSON.parse(dat);

coursesJsonArray.forEach(function(json){
  var coursetitle = json.CourseTitle;
  var inArray = false;
  for(var i = 0; i < remadeCourse.length;i++) {
    if (remadeCourse[i].CourseTitle == coursetitle){
      inArray = true;
      break;
    }
  }
  if (!inArray){
    studentArray = [];
    var sid = json.StudentID;
    studentArray.push({StudentRef : "",StudentID : sid});
    var newcourse = {coursetitle : {
      Students : studentArray,
      InstructorLastName : json.InstructorLastName,
      InstructorFirstName : json.InstructorFirstName,
      InstructorEmail : json.InstructorEmail,
      CourseSubject : json.CourseSubject,
      CourseSection : json.CourseSection,
      CourseTitle : json.CourseTitle,
      Term : json.Term,
    }};
    remadeCourse.push(newcourse);
  }
  else {
    var sid = json.StudentID;
    remadeCourse[coursetitle].Students.push({StudentRef : "",StudentID : sid});
  }
});

var coursejson = JSON.stringify(remadeCourse);
fs.writeFile("/import/courses.json",coursejson, function(err){
  if (err) throw err;
  console.log('It is saved');
});
