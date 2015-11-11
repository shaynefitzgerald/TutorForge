var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  Start : Date,
  End : Date,
  Subject : String,
  Location : String,
  Student : { type : mongoose.Schema.Types.ObjectId , ref : 'StudentModel' },
  Tutor : { type : mongoose.Schema.Types.ObjectId, ref : 'TutorModel' },
  RequestedProfessorNotification : Boolean,
  SentProfessorNotification : Boolean,
  FlagForArchival : Boolean,
};

exports.init = function(db){
  exports.tutor_Session = db.model('SessionModel', new mongoose.Schema(SchemaObject));
  exports.tutor_Session_FieldValidator = function(dat){
    return true;
  };
  exports.exportedFields = ['tutor_Session', 'tutor_Session_FieldValidator'];
};
