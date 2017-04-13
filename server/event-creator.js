const Token = require('./database/models').Token;
const User = require('./database/models').User;
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var fs = require('fs');
var readline = require('readline');

function authorize(credentials, callback, token, event) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  console.log('tokeno', token)
  oauth2Client.credentials = JSON.parse(token.token);
  callback(oauth2Client, event);
}



//req.body includes:interviewerid, use toget interviewer email, start and end time
//roomname/jobposition room.job_position + room.owner_id
exports.createEvent = function(req, res) {
  var event = {
    'summary': req.body.job_position + ' interview for ' ,
    'location': 'localhost:3000/#/interviewroom?roomid=' + req.body.roomid,
    'description': 'Your first inner-view',
    'start': {
      'dateTime': new Date(req.body.start),
      'timeZone': 'America/Los_Angeles'
    },
    'end': {
      'dateTime': new Date(req.body.end),
      'timeZone': 'America/Los_Angeles'
    },
    'attendees': [
      {'email': 'simondemoor0@gmail.com'},
      {'email': 'kasonjim@gmail.com'}
      ]
    }

  Token.find({where: {owner_id: req.body.interviewer_id}})
  .then(function(token) {
    if (!token) {
      console.log('error finding interviewer token')
      return;
    }
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the
      // Google Calendar API.
      authorize(JSON.parse(content), createEvento, token, event);//-------------------------------------this is done on server side
    });
    res.status(201).send();
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send(err);
  });
}







function createEvento(auth, event) {
  var calendar = google.calendar('v3');
    calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    }, function(err, event) {
        if (err) {
          console.log('The API failed to create event; error: ' + err);
          return;
        }
        console.log('Event created: %s', event.htmlLink);
      }
      )
  }



