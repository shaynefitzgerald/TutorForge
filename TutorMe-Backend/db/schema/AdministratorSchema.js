var mongoose = require('mongoose');
//TODO: import & initialize mongoose-types here
require('../mongoose-types/email.js').loadType(mongoose);

var SchemaObject = {
  Email : mongoose.Schema.Types.Email,
};

exports.init = function(db){
  var AdministratorSchema = new mongoose.Schema(SchemaObject);

  AdministratorSchema.virtual('Username').get(function(){
    var split = this.Email.toString().split('@');
    return split[0];
  });

  exports.tutor_Administrator = db.model('AdministratorModel', AdministratorSchema);
  exports.tutor_Administrator_FieldValidator = function(dat){
    return true;
  };
  exports.exportedFields = ['tutor_Administrator', 'tutor_Administrator_FieldValidator'];
};
