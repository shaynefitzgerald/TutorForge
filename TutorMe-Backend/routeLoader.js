var fs = require('fs');
var path = require('path');
exports.init = function(app, routePrefix, CASInstance, db) {
  var files = fs.readdirSync(__dirname + "/routes").filter(function(element) {
    if (path.extname(element) === '.js') return true;
    return false;
  });
  for(var x = 0; x < files.length; x++){
    var routePath = '/api/' + path.basename(files[x], '.js');
    app.use(routePath, require(routePrefix + files[x]).init(CASInstance, db));
  }
};
