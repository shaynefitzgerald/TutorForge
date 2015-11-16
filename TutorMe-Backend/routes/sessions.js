var express = require('express');

exports.init = function(cas, db){
  var router = express.Router();

  var permissions = 't';

  router.post('/endSession',  function(req, res){
    res.end();
  });
  router.get('/getPreviousSessions',  function(req, res){
    res.end();
  });
  router.get('/getScheduledSessions', function(req, res){
    res.end();
  });

  return router;
};
