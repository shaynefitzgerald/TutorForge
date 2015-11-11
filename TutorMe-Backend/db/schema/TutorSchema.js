var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  isStudentTutor : Boolean,
  ID : { type : Number, unique : true },
  Email : mongoose.schema.types.Email,
  StudentRef : { type : mongoose.Schema.Types.ObjectId, ref : 'StudentModel' },
  Subject : String,
  Sessions : [
    { type : mongoose.Schema.Types.ObjectId, ref : 'SessionModel' }
  ],
  LifetimeSessionCount : Number,
  LastArchivedSession : Date,
};

exports.init = function(db){
  var TutorSchema = new mongoose.Schema(SchemaObject);

  TutorSchema.virtual('Username').get(function(){
    var split = this.Email.toString().split('@');
    return split[0];
  });

  exports.tutor_Tutor = db.model('TutorModel', TutorSchema);
  exports.tutor_Tutor_FieldValidator = function(dat){
    return true;
  };
  exports.exportedFields = ['tutor_Tutor', 'tutor_Tutor_FieldValidator'];
};
