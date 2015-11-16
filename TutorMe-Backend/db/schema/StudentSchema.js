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
  Username : { virtuals : true },
};

exports.init = function(db){
  var StudentSchema = new mongoose.Schema(SchemaObject);

  StudentSchema.virtual('Username').get(function(){
    var split = this.Email.toString().split('@');
    return split[0];
  });

  exports.tutor_Student = db.model('StudentModel', StudentSchema);
  exports.tutor_Student_FieldValidator = function(dat){
    return true;
  };
  exports.exportedFields = ['tutor_Student', 'tutor_Student_FieldValidator'];
};
