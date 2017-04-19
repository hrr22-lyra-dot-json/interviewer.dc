const User = require('./database/models').User;
const Meeting = require('./database/models').Meeting;
const UserMeeting = require('./database/models').UserMeeting;
const Timeslot = require('./database/models').Timeslot;
const Token = require('./database/models').Token;
const Question = require('./database/models').Question;
const Interview = require('./database/models').Interview;
var google = require('googleapis');
var googleAuth = require('google-auth-library');
//var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var fs = require('fs');
var readline = require('readline');
var refresh = require('passport-oauth2-refresh');
// const utils = require('../lib/server_utility.js');

/*
** Expected request body: {owner_id(integer): 'user id', job_position(string): 'job position'}
** Expected response: 201 Created status
** Expected response on database error: 500 Internal Server Error status
*/
exports.addMeeting = function(req, res) {
  var retries = 3;
  User.find({where:{id: req.body.owner_id}})
  .then(function(user) {

    Token.find({where: {owner_id: req.body.owner_id}})
    .then(function(token) {
      if(!token) {  console.log('error 1');
        return send401Response();
      }
      var makeRequest = function() {
        var fileMetadata = {
          'name' : req.body.job_position,
          'mimeType' : 'application/vnd.google-apps.folder'
        };
        if (user.drive_folder_id) {
          fileMetadata.parents = [user.drive_folder_id];
        }
        retries--;
        console.log('run number', (3 - retries))
        if(!retries) {
          console.log('error 2')        // Couldn't refresh the access token.
          return send401Response();
        }
    // Set the credentials and make the request.
        var auth = new google.auth.OAuth2;
        auth.setCredentials({
          access_token: token.token,
          refresh_token: token.refreshToken
        });

        var drive = google.drive('v3');
        drive.files.create({
          auth: auth,
          resource: fileMetadata,
          fields: 'id'
        }, function(err, file) {
          if (err) {
            console.log('The API failed to create folder error: ' + err);
            refresh.requestNewAccessToken('google', token.refreshToken, function(err, accessToken) {
              if(err || !accessToken) {     console.log('error 3', err);
                return send401Response(); }
          // Save the new accessToken for future use
              token.update({ token: accessToken }, function(token) {
                console.log('retrywithnewtoken')
           // Retry the request.
                makeRequest();
              });
            });
          } else {
            var meetingObj = req.body;
            meetingObj.folder_id = file.id;
            Meeting.create(meetingObj)
            .then(function(newMeeting) {
              res.status(201).send();
            }).catch(function(err) {
              console.error(err);
              res.status(500).send(err);
            });
          };
        })
      }
      makeRequest();
    })
  })
}




/*
** Expected request query: {owner_id(integer): 'owner id'}
** Expected response: 200 OK status, [{id(integer): 'id', owner_id(integer): 'user id', job_position(string): 'job position'}]
** Expected response on database error: 500 Internal Server Error status
*/
exports.listMeetings = function(req, res) {
  Meeting.findAll({where: req.query})
  .then(function(foundMeetings) {
    res.status(200).send(foundMeetings);
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};



exports.listInterviews = function(req, res) {
  Interview.findAll({where: req.query})
  .then(function(foundInterviews) {
    res.status(200).send(foundInterviews);
  }).catch(function(err) {
    res.status(500).send(err);
  });
};

/*
** Expected request query: {id(integer): 'id'}
** Expected resposne: 200 OK status
** Expected response on database error: 500 Internal Server Error status
*/
exports.deleteMeeting = function(req, res) {
  Meeting.destroy({where: req.query})
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
** Expected response if user does not exist: 201 Created status, {username(string): 'username', email(string): 'user email'}
** Expected response on database error: 500 Internal Server Error status
*/
exports.addUser = function(req, res) {
  // See if email already exists in database
  User.findOne({where: {email: req.body.email}})
  .then(function(foundUser)  {
    if (foundUser) {
      res.status(409).send(foundUser);
    } else {
      // username and email do not exist in database so create new user
      User.create(req.body)
      .then(function(newUser) {
        res.status(201).send(newUser);
      }).catch(function(err) {
        console.error(err);
        res.status(500).send(err);
      });
    }
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

exports.getUserInfo = function(req, res) {
  User.findOne({where: {id: req.body.interviewerId}})
  .then(function(foundUser) {
    res.status(200).send(foundUser);
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  })
}





/*
** Expected request body: {username(string): 'username', email(string): 'user email'}
** Expected response if user exists: 200 OK status, {username(string): 'username', email(string): 'user email'}
** Expected response if user does not exist: 201 Created status, {username(string): 'username', email(string): 'user email'}
** Expected response on database error: 500 Internal Server Error status
*/
exports.checkGmailUser = function(req, res) {
  User.findOrCreate({where: {email: req.body.email}, defaults: {username: req.body.username}})
  .spread(function(newUser, created) {
    if (created) {
      res.status(201).send(newUser);
    } else {
      res.status(200).send(newUser);
    }
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected request body: {user_id(integer): 'user id', meeting_id(integer): 'meeting id'}
** Expected response if usermeeting exists: 409 Conflict status
** Expected response if usermeeting does not exist: 201 Created status
** Expected response on database error: 500 Internal Server Error status
*/
exports.addUserMeeting = function(req, res) {
  UserMeeting.findOrCreate({where: req.body})
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
** Expected response: 200 OK status, [{id(integer): 'id', user_id(integer): 'user id', meeting_id(integer): 'meeting id', createdAt(date): 'creation date', updatedAt(date): 'last updated date'}]
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
** Expected response: 200 OK status, [{id(integer): 'id', user_id(integer): 'user id', meeting_id(integer): 'meeting id', createdAt(date): 'creation date', updatedAt(date): 'last updated date'}]
** Expected response on database error: 500 Internal Server Error status
*/
exports.listUserMeetings = function(req, res) {
  UserMeeting.findAll({where: req.query})
  .then(function(foundUserMeetings) {
    res.status(200).send(foundUserMeetings);
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected request query: {id(integer): 'id'}
** Expected response: 200 OK status
** Expected response on database error: 500 Internal Server Error status
*/
exports.deleteUserMeeting = function(req, res) {
  UserMeeting.destroy({where: req.query})
  .then(function(affectedRows) {
    res.status(200).send();
  }).catch(function(err) {
    console.error(err);
    res.status(500).send();
  });
};

/*
** Expected request body: {owner_id(integer): 'user id', start(date): 'start time', end(date): 'end time', title(string): 'timeslot title'}
** Expected response: 201 Created status
** Expected response on database error: 500 Internal Server Error status
*/
exports.addTimeslot = function(req, res) {
  Timeslot.create(req.body)
  .then(function(newTimeslot) {
    res.status(201).send(newTimeslot);
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected request body: {timeslots: [{owner_id(integer): 'user id', start(date): 'start time', end(date): 'end time', title(string): 'timeslot title'}]}
** Expected response: 201 Created status
** Expected response on database error: 500 Internal Server Error status
*/
exports.addMultipleTimeslots = function(req, res) {
  console.log('requestbody', req.body)
  Timeslot.bulkCreate(req.body.timeslots)
  .then(function() {
    res.status(201).send();
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected response: 200 OK status, [{id(integer): 'id', owner_id(integer): 'owner id', start(date): 'start time', end(date): 'end time', title(string): 'timeslot title', createdAt(date): 'creation date', updatedAt(date): 'last updated date'}]
** Expected response on database error: 500 Internal Server Error status
*/
exports.listAllTimeslots = function(req, res) {
  Timeslot.findAll()
  .then(function(foundTimeslots) {
    res.status(200).send(foundTimeslots);
  }).catch(function(err) {
    res.status(500).send(err);
  });
};

/*
** Expected request query: {owner_id(integer): 'user id'}
** Expected response: 200 OK status, [{id(integer): 'id', owner_id(integer): 'owner id', start(date): 'start time', end(date): 'end time', title(string): 'timeslot title', createdAt(date): 'creation date', updatedAt(date): 'last updated date'}]
** Expected response on database error: 500 Internal Server Error status
*/
exports.listTimeslots = function(req, res) {
  Timeslot.findAll({where: req.query})
  .then(function(foundTimeslots) {
    res.status(200).send(foundTimeslots);
  }).catch(function(err) {
    res.status(500).send(err);
  });
};

/*
** Expected request query: {id: 'id'}
** Expected response: 200 OK status
** Expected response on database error: 500 Internal Server Error status
*/
exports.deleteTimeslot = function(req, res) {
  Timeslot.destroy({where: {id: req.query.id}})
  .then(function(affectedRows) {
    res.status(200).send();
  }).catch(function(err) {
    res.status(500).send(err);
  });
};

/*
** Expected request body: {owner_id(integer): 'user id', token(string): 'stringified token'}
** Expected response: 201 Created status
** Expected response on database error: 500 Internal Server Error status
**
** This will create a user token if the user does not have one and update a previous token if the user does
*/
exports.updateToken = function(req, res) {
  Token.findOrCreate({where: {owner_id: req.body.owner_id}, defaults: {token: req.body.token}})
  .spread(function(newToken, created) {
    if (!created) {
      return newToken.update({token: req.body.token});
    }
  }).then(function() {
    res.status(201).send();
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected request body: {meeting_id(integer): 'meeting id', question(string): 'THE question'}
** Expected response: 201 Created status
** Expected response on database error: 500 Internal Server Error status
*/
exports.addQuestion = function(req, res) {
  Question.create(req.body)
  .then(function(newQuestion) {
    res.status(201).send(newQuestion);
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected request body: {questions: [{meeting_id(integer): 'meeting id', question(string): 'THE question'}]}
** Expected response: 201 Created status
** Expected response on database error: 500 Internal Server Error status
*/
exports.addMultipleQuestions = function(req, res) {
  Question.bulkCreate(req.body.questions)
  .then(function() {
    res.status(201).send();
  }).catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
};

/*
** Expected request query: {meeting_id(integer): 'meeting id'}
** Expected response: 200 OK status, [{meeting_id: 'meeting id', question: 'THE question'}]
** Expected response on database error: 500 Internal Server Error status
*/
exports.listQuestions = function(req, res) {
  Question.findAll({where: req.query})
  .then(function(foundQuestions) {
    res.status(200).send(foundQuestions);
  }).catch(function(err) {
    res.status(500).send(err);
  });
};

/*
** Expected request query: {id(integer): 'id'}
** Expected response: 200 OK status
** Expected response on database error: 500 Internal Server Error status
*/
exports.deleteQuestion = function(req, res) {
  Question.destroy({where: {id: req.query.id}})
  .then(function(affectedRows) {
    res.status(200).send();
  }).catch(function(err) {
    res.status(500).send(err);
  });
};
