var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  isStudentTutor: Boolean,
  ID: {
    type: Number,
    unique: true
  },
  FirstName: String,
  LastName: String,
  Email: mongoose.Schema.Types.Email,
  StudentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentModel'
  },
  Subject: String,
  Sessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionModel'
  }],
  LifetimeSessionCount: Number,
  LastArchivedSession: Date,
};
var SchemaOptions = {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  }
};

exports.init = function(db) {
  var TutorSchema = new mongoose.Schema(SchemaObject, SchemaOptions);

  TutorSchema.virtual('Username').get(function() {
    var split = this.Email.toString().split('@');
    return split[0];
  });
  TutorSchema.virtual('FullName').get(function() {
    return this.FirstName + " " + this.LastName;
  });

  exports.tutor_Tutor = db.model('TutorModel', TutorSchema);
  exports.tutor_Tutor_FieldValidator = function(dat) {
    return true;
  };
  exports.exportedFields = ['tutor_Tutor', 'tutor_Tutor_FieldValidator'];
};