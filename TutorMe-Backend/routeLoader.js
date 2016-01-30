var fs = require('fs');
var path = require('path');
exports.init = function(app, routePath, CASInstance, db) {
  var files = fs.readdirSync(__dirname + "/routes").filter(function(element) {
    if (path.extname(element) === '.js') return true;
    return false;
  });
  for(var x = 0; x < files.length; x++){
    app.use('/api/' + path.basename(files[x], '.js'), require(files[x]).init(CASInstance, db));
  }
};
