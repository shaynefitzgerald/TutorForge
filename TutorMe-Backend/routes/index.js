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
  return router;
};
