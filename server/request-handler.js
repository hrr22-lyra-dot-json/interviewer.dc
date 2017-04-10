var User = require('./database/models').User;
var Meeting = require('./database/models').Meeting;
var UserMeeting = require('./database/models').UserMeeting;
var utils = require('../lib/server_utility.js');

/*
** Expected request body: {user_id(integer): 'user id', time(date): 'datetime for meeting'}
** Expected response: 201 Created status
** Expected response on database error: 500 Internal Server Error status
*/
exports.addMeeting = function(req, res) {
  Meeting.create({owner_id: req.body.owner_id, room_url: utils.generateUrl(), time: req.body.time})
  .then(function(Meeting) {
    res.status(201).send();
  }).catch(function(err) {
    console.error(err);
    res.status(500).send();
  });
};

/*
** Expected request body: {username(string): 'username', email(string): 'user email'}
** Expected response if user exists: 409 Conflict status
** Expected response if user does not exist: 201 Created status
** Expected response on database error: 500 Internal Server Error status
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
      }).catch(function(err) {
        console.error(err);
        res.status(500).send();
      });
    }
  });
};

/*
** Expected request body: {user_id(integer): 'user id', meeting_id(integer): 'meeting id'}
** Expected response if usermeeting exists: 409 Conflict status
** Expected response if usermeeting does not exist: 201 Created status
** Expected response on database error: 500 Internal Server Error status
*/
exports.addUserMeeting = function(req, res) {
  UserMeeting.findOrCreate({where: {user_id: req.body.user_id, meeting_id: req.body.meeting_id}})
  .spread(function(UserMeeting, created) {
    if (created) {
      res.status(201).send();
    } else {
      res.status(409).send();
    }
  }).catch(function(err) {
    console.error(err);
    res.status(500).send();
  });
};

/*
** Expected response: 200 OK status, {usermeetings(array): [{user_id(integer): 'user id', meeting_id(integer): 'meeting id'}]}
** Expected response on database error: 500 Internal Server Error status
*/
exports.listAllUserMeetings = function(req, res) {
  UserMeeting.findAll()
  .then(function(UserMeetings) {
    res.status(200).send(UserMeetings);
  }).catch(function(err) {
    console.error(err);
    res.status(500).send();
  });
};

/*
** Expected request query: {user_id(integer): 'user id'}
** Expected response: 200 OK status, {usermeetings(array): [{user_id(integer): 'user id', meeting_id(integer): 'meeting id'}]}
** Expected response on database error: 500 Internal Server Error status
*/
exports.listUserMeetings = function(req, res) {
  UserMeeting.findAll({where: {user_id: req.query.user_id}})
  .then(function(UserMeetings) {
    res.status(200).send(UserMeetings);
  }).catch(function(err) {
    console.error(err);
    res.status(500).send();
  });
};

/*
** Expected request query: {user_id(integer): 'user id', {meeting_id(integer): 'meeting id'}}
** Expected response: 200 OK status
** Expected response on database error: 500 Internal Server Error status
*/
exports.deleteUserMeeting = function(req, res) {
  UserMeeting.destroy({where: {user_id: req.query.user_id, meeting_id: req.query.meeting_id}})
  .then(function(affectedRows) {
    res.status(200).send();
  }).catch(function(err) {
    console.error(err);
    res.status(500).send();
  });
};
