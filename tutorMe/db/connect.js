var mongoose = require('mongoose');
var schema = require('./schema/index');
var config = JSON.parse(fs.readFileSync('./config.json'));
var db_Connection = mongoose.connect(config.ApplicationURI);
//var db_ArchiveConnection = mongoose.connect(config.ArchiveURI);
exports.schema = {};
schema.forEach(function(e){
  e.init(db_connection);
  e.exportedFields.forEach(function(d){
    schema[d] = e[d];
    schema.exportedFields.push(d);
  });
});
exports.applicationConnection = db_Connection;
//exports.archiveConnection = db_ArchiveConnection;
