var express = require('express');

var fn_error = function(res, err){
  return res.end(JSON.stringify({
    success : false,
    error : err,
  }));
};
var fn_success = function(res, result){
  res.end(JSON.stringify({ success : true, result : result }));
};

exports.init = function(cas, db){
  var router = express.Router();
  /* GET home page. */
  router.get('/', cas.bounce, function(req, res) {
    if(req.session.userPermissions.indexOf('a') >= 0)
      return res.sendFile('Admin Home.html', {'root' : __dirname + '/../public/'});
    if(req.session.userPermissions.indexOf('t') >= 0)
      return res.sendFile('Tutor Home.html', {'root' : __dirname + '/../public/'});
    return res.sendFile('Student Home.html', {'root' : __dirname + '/../public/'});

  });
  router.get('/user', cas.block, function(req, res, next){
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
  router.get('/resetFlags', cas.block, function(req, res){
    req.session.userPermissions = "";
    return fn_success(res, req.session);
  });
  router.post('/setPermissionsFlags', cas.block , function(req, res){
    res.type('application/json');
    var body = req.body;
    if(body.flags === undefined) fn_error(res, "Missing Parameter: flags");
    req.session.userPermissions = body.flags;
    return fn_success(res, req.session);
  });

  router.get('/api/iosauthenticate', cas.bounce, function(req, res){
    res.type('application/json');
    return fn_success(res, req.session);
  });

  return router;
};
