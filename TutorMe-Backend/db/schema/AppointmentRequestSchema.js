var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  Student : { type : mongoose.schema.types.ObjectId, ref : 'StudentModel' },
  Tutor : { type : mongoose.schema.types.ObjectId, ref : 'TutorModel' },
  RequestedStart : Date,
  Location : String,
  Subject : String,
};

exports.init = function(db){
  exports.tutor_AppointmentRequest = db.model('AppointmentRequestModel', new mongoose.Schema(SchemaObject));
  exports.tutor_AppointmentRequest_FieldValidator = function(dat){
    return true;
  };
  exports.exportedFields = ['tutor_AppointmentRequest', 'tutor_AppointmentRequest_FieldValidator'];
};
