var fs = require('fs');
exports.dir = [];
var files = fs.readdirSync(__dirname);
for(var x = 0; x < files.length; x++){
  if(files[x].substr(files[x].length-3, files[x].length) == '.js'){
    if(files[x] == "index.js")
      continue;
    exports.dir.push(require(__dirname  +'/'+ files[x]));
  }
}
//console.log(exports.dir);
