var express = require('express');
var security = require('./security.js');

exports.init = function(cas, db){
  var router = express.Router();

  var permissions = 't';

  router.post('/endSession', cas.block, function(req, res){
    res.end();
  });
  router.get('/getPreviousSessions', cas.block, function(req, res){
    res.end();
  });
  router.post('/getScheduledSessions', cas.block, function(req, res){
    res.end();
  });

  return router;
};
