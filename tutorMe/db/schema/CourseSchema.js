var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  Students : [{
    StudentRef : { type : mongoose.Schema.Types.ObjectId, ref : 'StudentModel' },
    StudentID : String,
    CourseGrade : String,
  }],
  InstructorLastName : String,
  InstructorFirstName : String,
  InstructorEmail : mongoose.Schema.Types.Email,
  CourseSubject : String,
  CourseSection : String,
  CourseTitle : String,
  Term : String,
};

exports.init = function(db){
  exports.tutor_Course = db.model('CourseModel', new mongoose.Schema(SchemaObject));
  exports.tutor_Course_FieldValidator = function(dat){
    return true;
  };
};
