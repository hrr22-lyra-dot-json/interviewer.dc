var User = require('./database/models').User;
var Meeting = require('./database/models').Meeting;
var UserMeeting = require('./database/models').UserMeeting;

/*
** Expected request body: {user_id(integer): 'user id', time(date): 'datetime for meeting'}
** Expected response: 201 Created status
*/
exports.addMeeting = function(req, res) {
};

/*
** Expected request body: {username(string): 'username', email(string): 'user email'}
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

/*
** Expected request body: {user_id(integer): 'user id', meeting_id(integer): 'meeting id'}
** Expected resposne if usermeeting exists: 409 Conflict status
** Expected response if usermeeting does not exist: 201 Created status
*/
exports.addUserMeeting = function(req, res) {
  UserMeeting.findOrCreate({where: {user_id: req.body.user_id, meeting_id: req.body.meeting_id}})
  .spread(function(UserMeeting, created) {
    if (created) {
      res.status(201).send();
    } else {
      res.status(409).send();
    }
  });
};
