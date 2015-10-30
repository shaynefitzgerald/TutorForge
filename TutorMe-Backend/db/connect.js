var mongoose = require('mongoose');
var schema = require('./schema/index').dir;
var config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json'));
var db_Connection = mongoose.connect(config.ApplicationURI);
db_Connection.on('error', console.error.bind(console, 'connection error:'));
//var db_ArchiveConnection = mongoose.connect(config.ArchiveURI);
exports.schema = {};
exports.schema.exportedFields = [];
schema.forEach(function(e){
  e.init(db_Connection);
  e.exportedFields.forEach(function(d){
    exports.schema[d] = e[d];
    exports.schema.exportedFields.push(d);
  });
});
exports.applicationConnection = db_Connection;
//exports.archiveConnection = db_ArchiveConnection;
