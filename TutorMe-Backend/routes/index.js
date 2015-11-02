var express = require('express');
var router = express.Router();

exports.init = function(cas, db){
  /* GET home page. */
  router.get('/', cas.bounce, function(req, res, next) {
    //TODO: serve index
    res.end();
  });
  router.get('/user', cas.bounce, function(req, res, next){
    return res.end(JSON.stringify({ username : req.session.cas_user }));
  });
  router.get('/docs', cas.block, function(req, res, next){
    try{
      require('fs').readFile(__dirname + "/README.md", function(err, data){
        if(err) return res.end(err.toString());
        return res.end(require('node-markdown').Markdown(data.toString()));
      });
    } catch (e){
      return res.end(e.toString());
    }
  });
  return router;
};
