const Token = require('./database/models').Token;
const User = require('./database/models').User;
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var fs = require('fs');
var readline = require('readline');
var refresh = require('passport-oauth2-refresh');
const Interview = require('./database/models').Interview;
const Meeting = require('./database/models').Meeting;



exports.createEvent = function(req, res, next) {
  console.log('logged in user:', req.user)
  var retries = 3;
  var send401Response = function() {
    return res.status(401).end();
  };

  Interview.create({
    owner_id: req.body.interviewer_id,
    start: new Date(req.body.start),
    end: new Date(req.body.end),
    interviewee_name: req.body.interviewee_name,
    interviewee_email: req.body.interviewee_email,
    title: req.body.job_position + ' interview for ' + req.body.interviewee_name,
    roomid: req.body.roomDbId,
    status: 'created'
  })
  .then(function(interview) {
    console.log('created interview in db', interview)
    Token.find({where: {owner_id: req.body.interviewer_id}})
    .then(function(token) {
      if(!token) {
        console.log('error 1');
        return send401Response();
      }
      var tokener = token;
      Meeting.find({where:{id: req.body.roomDbId}})
      .then(function(room) {
        console.log('found room')
        var fileMetadata = {
          'name' : req.body.interviewee_name,
          'mimeType' : 'application/vnd.google-apps.folder',
          'parents': [room.folder_id]
        };
        var makeRequest = function() {
          retries--;
          console.log('run number', (3 - retries))
          if(!retries) {
            console.log('Error creating google event and drive folder; could not refresh access token')// Couldn't refresh the access token.
            return send401Response();
          }
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
              console.log('error amking folder', err)
              refresh.requestNewAccessToken('google', token.refreshToken, function(err, accessToken) {
                if(err || !accessToken) {
                  console.log('error 3', err);
                  return send401Response();
                }
                token.update({ token: accessToken }, function(token) {// Save the new accessToken for future use
                  console.log('retrywithnewtoken')// Retry the request.
                  makeRequest();
                });
              });
            } else {
              interview.update({drive_link: file.id})
              .then(function(updatedInterview) {
                console.log('sucess making folder',updatedInterview )
              }).catch(function(err) {
                console.error(err);
                res.status(500).send(err);
              });
            }
          })
        }
        var event = {
          'summary': req.body.job_position + ' interview for ' + req.body.interviewee_name,
          'location': 'http://127.0.0.1:3000/#/interviewroom?roomid=' + interview.id,
          "source": {
            "url": 'http://127.0.0.1:3000/#/interviewroom?roomid=' + interview.id,
            "title": 'Link to Interviewroom'
          },
          'description': 'Interview',
          'start': {
            'dateTime': new Date(req.body.start),
            'timeZone': 'America/Los_Angeles'
          },
          'end': {
          'dateTime': new Date(req.body.end),
          'timeZone': 'America/Los_Angeles'
          },
          'attendees': [
          {'email': req.body.interviewer_email},
          {'email': req.body.interviewee_email}
          ],
          'sendNotifications': true
        }

        var makeEventRequest = function() {
          retries--;
          console.log('run number', (3 - retries))
          if(!retries) {
            console.log('error 2')// Couldn't refresh the access token.
            return send401Response();
          }
          var auth = new google.auth.OAuth2;
          auth.setCredentials({
            access_token: token.token,
            refresh_token: token.refreshToken
          });
          var calendar = google.calendar('v3');
          calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: event,
            sendNotifications: true
          }, function(err, event) {
            if (err) {
              console.log('The API failed to create event; error: ' + err);
              refresh.requestNewAccessToken('google', token.refreshToken, function(err, accessToken) {
                if(err || !accessToken) {
                  console.log('error 3', err);
                  return send401Response();
                }
                token.update({ token: accessToken }, function(token) {// Save the new accessToken for future use
                  makeEventRequest();
                });
              });
            } else {
              if (event) {
                console.log('Event created: %s', event.htmlLink);
                res.status(201).send();
              } else {
                console.log('failed  run');
              }
            }
          })
        }
        makeRequest();
        makeEventRequest()
      })
})
})
}


//         }
//       var calendar = google.calendar('v3');
//       calendar.events.insert({
//         auth: auth,
//         calendarId: 'primary',
//         resource: event,
//         sendNotifications: true
//       }, function(err, event) {
//         if (err) {
//           console.log('The API failed to create event; error: ' + err);
//           refresh.requestNewAccessToken('google', token.refreshToken, function(err, accessToken) {
//             if(err || !accessToken) {
//               console.log('error 3', err);
//               return send401Response();
//             }
//             token.update({ token: accessToken }, function(token) {
//               console.log('retrywithnewtoken')
//               makeRequest();
//               });
//             });
//         } else {
//           if (event) {
//             console.log('Event created: %s', event.htmlLink);
//             res.status(201).send();
//           } else {
//             console.log('failed  run');
//           }
//         }
//       })
//     })
//   })
// }




//     var retries = 3;
//     console.log('this is the eventmaker:', req.body)

//     var send401Response = function() {
//       return res.status(401).end();
//     };
//     Token.find({where: {owner_id: req.body.interviewer_id}})
//     .then(function(token) {
//       if(!token) {
//         console.log('error 1');
//         return send401Response();
//       }

//       var makeRequest = function() {
//         retries--;
//         console.log('run number', (3 - retries))
//         if(!retries) {
//           console.log('error 2')
//           // Couldn't refresh the access token.
//           return send401Response();
//         }

//         // Set the credentials and make the request.
//         var auth = new google.auth.OAuth2;
//         auth.setCredentials({
//           access_token: token.token,
//           refresh_token: token.refreshToken
//         });

//         var calendar = google.calendar('v3');
//         calendar.events.insert({
//           auth: auth,
//           calendarId: 'primary',
//           resource: event,
//           sendNotifications: true
//         }, function(err, event) {
//           if (err) {
//             console.log('The API failed to create event; error: ' + err);
//             refresh.requestNewAccessToken('google', token.refreshToken, function(err, accessToken) {
//               if(err || !accessToken) {
//                 console.log('error 3', err);
//                 return send401Response();
//               }

//               // Save the new accessToken for future use
//               token.update({ token: accessToken }, function(token) {
//                 console.log('retrywithnewtoken')
//                // Retry the request.
//                 makeRequest();
//               });
//             });
//             //return err;
//           } else {
//             if (event) {
//               console.log('Event created: %s', event.htmlLink);
//               res.status(201).send();
//             } else {
//               console.log('failed  run');
//             }
//           }
//         })
//       }
//       makeRequest();
//     })
//     Token.find({where: {owner_id: req.body.interviewer_id}})
//     .then(function(token) {
//       if(!token) {
//         console.log('error 1');
//         return;
//         //return send401Response();
//       }
//       var auth = new google.auth.OAuth2;
//       auth.setCredentials({
//         access_token: token.token,
//         refresh_token: token.refreshToken,
//         expiry_date: true
//       });
//       var drive = google.drive('v3');
//       drive.files.create({
//         auth: auth,
//         resource: fileMetadata,
//         fields: 'id'
//       }, function(err, file) {
//         if (err) {
//           console.log('error amking folder', err)
//         }
//         Interview.find({where:{id: req.body.interview_id}})
//             .then(function(interview) {
//               interview.update({drive_link: file.id})
//             })
//             .then(function(updatedInterview) {
//               res.status(201).send(updatedInterview);
//             }).catch(function(err) {
//               console.error(err);
//               res.status(500).send(err);
//             });
//   })
// }






//   })



//   // Get the user's credentials.
//   Token.find({where: {owner_id: req.body.interviewer_id}})
//   .then(function(token) {
//     if(!token) {  console.log('error 1');

// return send401Response(); }

//     var makeRequest = function() {
//       retries--;
//       console.log('run number', (3 - retries))
//       if(!retries) {
//             console.log('error 2')
//         // Couldn't refresh the access token.
//         return send401Response();
//       }

//       // Set the credentials and make the request.
//       var auth = new google.auth.OAuth2;
//       auth.setCredentials({
//         access_token: token.token,
//         refresh_token: token.refreshToken
//       });

//       var calendar = google.calendar('v3');
//       calendar.events.insert({
//         auth: auth,
//         calendarId: 'primary',
//         resource: event,
//         sendNotifications: true
//       }, function(err, event) {
//         if (err) {
//           console.log('The API failed to create event; error: ' + err);
//           refresh.requestNewAccessToken('google', token.refreshToken, function(err, accessToken) {
//             if(err || !accessToken) {     console.log('error 3', err);

// return send401Response(); }

//             // Save the new accessToken for future use
//             token.update({ token: accessToken }, function(token) {
//               console.log('retrywithnewtoken')
//              // Retry the request.
//              makeRequest();
//             });
//           });
//           //return err;
//         } else {

//         if (event) {
//           Meeting.find({where:{owner_id: req.body.interviewer_id, job_position: req.body.job_position}})
//           .then(function(meeting) {
//             Interview.create({
//               owner_id: req.body.interviewer_id,
//               start: new Date(req.body.start),
//               end: new Date(req.body.end),
//               interviewee_name: req.body.interviewee_name,
//               interviewee_email: req.body.interviewee_email,
//               title: req.body.job_position,
//               roomid: meeting.id,
//               status: 'created'
//             })
//             .then(function(interview) {
//               console.log('created interview in db', interview)

//             })
//           })
//           console.log('Event created: %s', event.htmlLink);
//           res.status(201).send();
//         } else {
//           console.log('failed  run');
//         }
//       }

// //   })
// //   .catch(function(err) {
// //     console.error(err);
// //     res.status(500).send(err);
// //   });
//       }
//       )
//     }
//     makeRequest();
//   });
// }




//       var gmail = google.gmail('v1');
//       var request = gmail.users.getProfile({
//         auth: auth,
//         userId: 'me'
//       });
//       request.then(function(resp) {
//         // Success! Do something with the response
//         return res.json(resp);

//       }, function(reason) {
//         if(reason.code === 401) {
//           // Access token expired.
//           // Try to fetch a new one.
//           refresh.requestNewAccessToken('google', user.refreshToken, function(err, accessToken) {
//             if(err || !accessToken) { return send401Response(); }

//             // Save the new accessToken for future use
//             user.save({ accessToken: accessToken }, function() {
//              // Retry the request.
//              makeRequest();
//             });
//           });

//         } else {
//           // There was another error, handle it appropriately.
//           return res.status(reason.code).json(reason.message);
//         }
//       });
//     };

//     // Make the initial request.
//     makeRequest();
//   });
// }


// function authorize(credentials, callback, token, event) {
//   var clientSecret = credentials.installed.client_secret;
//   var clientId = credentials.installed.client_id;
//   var redirectUrl = credentials.installed.redirect_uris[0];
//   var auth = new googleAuth();
//   var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
//   console.log('tokeno', token)
//   oauth2Client.credentials = JSON.parse(token.token);
//   callback(oauth2Client, event);
// }



// //req.body includes:interviewerid, use toget interviewer email, start and end time
// //roomname/jobposition room.job_position + room.owner_id
// exports.createEvent = function(req, res) {
//   var event = {
//     'summary': req.body.job_position + ' interview for Jason ',
//     'location': 'Washington',
//     "source": {
//       "url": 'http://127.0.0.1:3000/#/interviewroom?roomid=' + req.body.roomid,
//       "title": 'Link to Interviewroom'
//     },
//     'description': 'Your first inner-view',
//     'start': {
//       'dateTime': new Date(req.body.start),
//       'timeZone': 'America/Los_Angeles'
//     },
//     'end': {
//       'dateTime': new Date(req.body.end),
//       'timeZone': 'America/Los_Angeles'
//     },
//     'attendees': [
//       {'email': 'simondemoor0@gmail.com'},
//       {'email': 'kasonjim@gmail.com'}
//       ]
//     }
//     event.location = event.source;

//   Token.find({where: {owner_id: req.body.interviewer_id}})
//   .then(function(token) {
//     if (!token) {
//       console.log('error finding interviewer token')
//       return;
//     }
//     fs.readFile('client_secret.json', function processClientSecrets(err, content) {
//       if (err) {
//         console.log('Error loading client secret file: ' + err);
//         return;
//       }
//       // Authorize a client with the loaded credentials, then call the
//       // Google Calendar API.
//       authorize(JSON.parse(content), createEvento, token, event);//-------------------------------------this is done on server side
//     });
//     res.status(201).send();
//   })
//   .catch(function(err) {
//     console.error(err);
//     res.status(500).send(err);
//   });
// }







// function createEvento(auth, event) {
//   var calendar = google.calendar('v3');
//     calendar.events.insert({
//       auth: auth,
//       calendarId: 'primary',
//       resource: event,
//     }, function(err, event) {
//         if (err) {
//           console.log('The API failed to create event; error: ' + err);


//           return err;
//         }
//         console.log('Event created: %s', event.htmlLink);
//       }
//       )
//   }



