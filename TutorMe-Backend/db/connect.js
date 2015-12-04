var mongoose = require('mongoose');
var schema = require('./schema/index').dir;
var config = JSON.parse(require('fs').readFileSync(__dirname + '/config.json'));
var db_Connection = mongoose.createConnection(config.ApplicationURI, { server : { poolSize : 20 }});
var db_ArchiveConnection = mongoose.createConnection(config.ArchiveURI, { server : { poolSize : 20 }});
exports.schema = {};
exports.schema.exportedFields = [];
schema.forEach(function(e) {
  e.init(db_Connection);
  e.init(db_ArchiveConnection);
  e.exportedFields.forEach(function(d) {
    exports.schema[d] = e[d];
    exports.schema.exportedFields.push(d);
  });
});
exports.applicationConnection = db_Connection;
exports.archiveConnection = db_ArchiveConnection;
