var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  MajorSubject : { unique : true, type : String },
};

exports.init = function(db){
  exports.tutor_Course = db.model('MajorModel', new mongoose.Schema(SchemaObject));
  exports.tutor_Course_FieldValidator = function(dat){
    return true;
  };
  exports.exportedFields = ['tutor_Major', 'tutor_Major_FieldValidator'];
};
