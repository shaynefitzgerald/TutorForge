var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  isStudentTutor : Boolean,
  ID : { type : Number, unique : true },
  StudentRef : { type : mongoose.Schema.Types.ObjectId, ref : 'StudentModel' },
  Subject : String,
  Sessions : [
    { type : mongoose.Schema.Types.ObjectId, ref : 'SessionModel' }
  ],

};

exports.init = function(db){
  exports.tutor_Tutor = db.model('TutorModel', new mongoose.Schema(SchemaObject));
  exports.tutor_Tutor_FieldValidator = function(dat){
    return true;
  };
  exports.exportedFields = ['tutor_Tutor', 'tutor_Tutor_FieldValidator'];
};
