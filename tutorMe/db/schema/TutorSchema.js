var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  ID : { type : Number, unique : true },
  StudentRef : { type : mongoose.Schema.Types.ObjectId, ref : 'StudentModel'},
  Subject : String,
  
};

exports.init = function(db){
  exports.tutor_Tutor = db.model('TutorModel', new mongoose.Schema(SchemaObject));
  exports.tutor_Tutor_FieldValidator = function(dat){
    return true;
  };
};
