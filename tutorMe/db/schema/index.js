var fs = require('fs');
exports = [];
var files = fs.readDirSync('/');
for(var x = 0; x < files.length; x++){
  if(files[x].substr(files[x].length-2, files[x].length) == '.js'){
    exports.push(require('./' + files[x]));
  }
}
