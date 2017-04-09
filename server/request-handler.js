var User = require('./database/models').User;
var Meeting = require('./database/models').Meeting;
var UserMeeting = require('./database/models').UserMeeting;

/*
** Expected request body: {user_id: 'user id', time: 'datetime for meeting'}
** Expected response: 201 Created status
*/
exports.addMeeting = function(req, res) {
};

/*
** Expected request body: {username: 'username', email: 'user email'}
** Expected response if user exists: 409 Conflict status
** Expected response if user does not exist: 201 Created status
*/
exports.addUser = function(req, res) {
  // See if username or email already exists in database
  User.findOne({
    where: {
      $or: [
        {username: req.body.username},
        {email: req.body.email}
      ]
    }
  }).then(function(User)  {
    if (User) {
      res.status(409).send();
    } else {
      // username and email do not exist in database so create new user
      User.create({
        username: req.body.username,
        email: req.body.email
      }).then(function(User) {
        res.status(201).send();
      });
    }
  });
};
