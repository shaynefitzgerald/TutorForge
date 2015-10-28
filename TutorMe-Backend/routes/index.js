var express = require('express');
var router = express.Router();

exports.init = function(cas, db){
  /* GET home page. */
  router.get('/', cas.bounce, function(req, res, next) {
    //TODO: serve index
    res.end();
  });
  return router;
};
