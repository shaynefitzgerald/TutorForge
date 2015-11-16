var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  Student : { type : mongoose.Schema.Types.ObjectId, ref : 'StudentModel' },
  Tutor : { type : mongoose.Schema.Types.ObjectId, ref : 'TutorModel' },
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
