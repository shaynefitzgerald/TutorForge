var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  ID : { type : Number, unique : true },
  OtherID : Number,
  LastName : String,
  FirstName : String,
  FullName : String,
  Gender : String,
  Major : String,
  Email : mongoose.Schema.Types.Email,
  Courses : [{ type : mongoose.Schema.Types.ObjectId, ref : 'CourseModel' }],
  Sessions : [
    { type : mongoose.Schema.Types.ObjectId, ref : 'SessionModel' }
  ],
  IsTutor : Boolean,
  TutorRef : { type : mongoose.Schema.Types.ObjectId, ref : 'TutorModel' },
  LastSubmittedFeedback : Date,
};

exports.init = function(db){
  exports.tutor_Student = db.model('StudentModel', new mongoose.Schema(SchemaObject));
  exports.tutor_Student_FieldValidator = function(dat){
    return true;
  };
  exports.exportedFields = ['tutor_Student', 'tutor_Student_FieldValidator'];
};
