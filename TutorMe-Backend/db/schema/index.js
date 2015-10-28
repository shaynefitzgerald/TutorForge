var fs = require('fs');
exports.dir = [];
var files = fs.readdirSync('./db/schema/');
for(var x = 0; x < files.length; x++){
  if(files[x].substr(files[x].length-3, files[x].length) == '.js'){
    exports.dir.push(require('./' + files[x]));
  }
}
