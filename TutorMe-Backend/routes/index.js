var express = require('express');


exports.init = function(cas, db){
  var router = express.Router();
  /* GET home page. */
  router.get('/', function(req, res, next) {
    //TODO: serve index
    res.end( JSON.stringify( req.session ) );
  });
  router.get('/user', function(req, res, next){
    return res.end(JSON.stringify({ username : req.session.cas_user }));
  });
  router.get('/docs', function(req, res, next){
    try {
      require('fs').readFile(__dirname + "/../README.html", function(err, data){
        if(err) return res.end(err.toString());
        return res.end(require('node-markdown').Markdown(data.toString()));
      });
    } catch (e){
      return res.end(e.toString());
    }
  });
  return router;
};
