const User = require('./database/models').User;
const Meeting = require('./database/models').Meeting;
const UserMeeting = require('./database/models').UserMeeting;
const Timeslot = require('./database/models').Timeslot;
const utils = require('../lib/server_utility.js');

/*
** Expected request body: {owner_id(integer): 'user id', time(date): 'datetime for meeting'}
** Expected response: 201 Created status
** Expected response on database error: 500 Internal Server Error status
*/
exports.addMeeting = function(req, res) {
  Meeting.create({owner_id: req.body.owner_id, room_url: utils.generateUrl(), time: req.body.time})
  .then(function(newMeeting) {
    res.status(201).send();
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected request query: {meeting_id(integer): 'meeting id'}
** Expected resposne: 200 OK status
** Expected response on database error: 500 Internal Server Error status
*/
exports.deleteMeeting = function(req, res) {
  Meeting.destroy({where: {id: req.query.meeting_id}})
  .then(function(affectedRows) {
    res.status(200).send();
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
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
  }).then(function(newUser)  {
    if (newUser) {
      res.status(409).send(newUser);
    } else {
      // username and email do not exist in database so create new user
      User.create({
        username: req.body.username,
        email: req.body.email
      }).then(function(newUser) {
        res.status(201).send(newUser);
      }).catch(function(err) {
        console.error(err);
        res.status(500).send(err);
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
  .spread(function(newUserMeeting, created) {
    if (created) {
      console.log(newUserMeeting);
      res.status(201).send(newUserMeeting);
    } else {
      res.status(409).send(newUserMeeting);
    }
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected response: 200 OK status, {usermeetings(array): [{id(integer): 'id', user_id(integer): 'user id', meeting_id(integer): 'meeting id', createdAt(date): 'creation date', updatedAt(date): 'last updated date'}]}
** Expected response on database error: 500 Internal Server Error status
*/
exports.listAllUserMeetings = function(req, res) {
  UserMeeting.findAll()
  .then(function(foundUserMeetings) {
    res.status(200).send(foundUserMeetings);
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected request query: {user_id(integer): 'user id'}
** Expected response: 200 OK status, {usermeetings(array): [{id(integer): 'id', user_id(integer): 'user id', meeting_id(integer): 'meeting id', createdAt(date): 'creation date', updatedAt(date): 'last updated date'}]}
** Expected response on database error: 500 Internal Server Error status
*/
exports.listUserMeetings = function(req, res) {
  UserMeeting.findAll({where: {user_id: req.query.user_id}})
  .then(function(foundUserMeetings) {
    res.status(200).send(foundUserMeetings);
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
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

/*
** Expected request body: {owner_id(integer): 'user id', start(date): 'start time', end(date): 'end time'}
** Expected response: 201 Created status
** Expected response on database error: 500 Internal Server Error status
*/
exports.addTimeslot = function(req, res) {
  Timeslot.create({owner_id: req.body.owner_id, start: req.body.start, end: req.body.end})
  .then(function(newTimeslot) {
    res.status(201).send(newTimeslot);
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected response: 200 OK status, {id(integer): 'id', owner_id(integer): 'owner id', start(date): 'start time', end(date): 'end time', createdAt(date): 'creation date', updatedAt(date): 'last updated date'}
** Expected response on database error: 500 Internal Server Error status
*/
exports.listAllTimeslots = function(req, res) {
  Timeslot.findall()
  .then(function(foundTimeslots) {
    res.status(200).send(foundTimeslots);
  }).catch(function(err) {
    res.status(500).send(err);
  });
};
