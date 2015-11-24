module.exports = function(cas, db){
  return function(req, res, next){
    if(req.session.cas_user === undefined)
      return next();
    if(req.session.userPermissions !== undefined)
      return next();

    var error = function(res, err){
      return res.end(JSON.stringify({
        success : false,
        error : err,
      }));
    };
    var StudentModel = db.model('StudentModel');
    var TutorModel = db.model('TutorModel');
    var AdministratorModel = db.model('AdministratorModel');
    return StudentModel.findOne({ Username : req.session.cas_user}, function(err, studentResult){
      if(err) return error(res, err);
      if(studentResult !== undefined){
        if(req.session.userPermissions === undefined){
          req.session.userPermissions = "s";
        } else {
          req.session.userPermissions += "s";
        }
      }
      return TutorModel.findOne({ Username : req.session.cas_user}, function(err, tutorResult){
        if(err) return error(res, err);
          if(studentResult !== undefined){
            if(req.session.userPermissions === undefined){
              req.session.userPermissions = "t";
            } else {
              req.session.userPermissions += "t";
            }
          }
        return AdministratorModel.findOne({ Username : req.session.cas_user}, function(err, administratorResult){
            if(studentResult !== undefined){
              if(req.session.userPermissions === undefined){
                req.session.userPermissions = "a";
              } else {
                req.session.userPermissions += "a";
              }
            }
          return next();
        });
      });
    });
  };
};
