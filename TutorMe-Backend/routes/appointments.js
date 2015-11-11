var express = require('express');


exports.init = function(cas, db){
  var router = express.Router();

  router.get('/getAppointmentRequests', cas.block, function(req, res){
    res.end();
  });
  router.post('/respondToRequest', cas.block, function(req, res){
    res.end();
  });
  router.post('/withdrawRequest', cas.block, function(req, res){
    res.end();
  });

  return router;
};
