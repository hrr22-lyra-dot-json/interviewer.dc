var requestHandler = require('./request-handler.js');
var eventCreator = require('./event-creator.js');

function ensureAuthenticated(req, res, next) {
  console.log('isauthed', req.user)
  if (req.isAuthenticated()) { console.log('isauthed', req.user);
  return next(); }
  res.redirect('/');
}

module.exports = function(app) {
  app.post('/api/Meeting', ensureAuthenticated, requestHandler.addMeeting);
  app.get('/api/Meetings', ensureAuthenticated, requestHandler.listMeetings);
  app.delete('/api/Meeting', requestHandler.deleteMeeting);

 // app.post('/api/User', requestHandler.addUser);
  app.post('/api/getUser', requestHandler.getUserInfo);
  //app.post('/api/gmailUser', requestHandler.checkGmailUser);

  //app.post('/api/UserMeeting', requestHandler.addUserMeeting);
  // List all rows in the UserMeeting table
  //app.get('/api/allUserMeetings', requestHandler.listAllUserMeetings);
  // List all meetings that a specific user is part of
  //app.get('/api/UserMeetings', requestHandler.listUserMeetings);
  //app.delete('/api/UserMeeting', requestHandler.deleteUserMeeting);

  app.post('/api/Timeslot', ensureAuthenticated, requestHandler.addTimeslot);
  app.post('/api/Timeslots', requestHandler.addMultipleTimeslots);
  app.get('/api/allTimeslots', requestHandler.listAllTimeslots);
  app.get('/api/Timeslots', requestHandler.listTimeslots);
  app.delete('/api/Timeslot', requestHandler.deleteTimeslot);

  app.post('/api/Token',ensureAuthenticated,  requestHandler.updateToken);

  app.post('/api/Question', ensureAuthenticated, requestHandler.addQuestion);
  app.post('/api/Questions',ensureAuthenticated,  requestHandler.addMultipleQuestions);
  app.get('/api/Questions', ensureAuthenticated, requestHandler.listQuestions);
  app.delete('/api/Question',ensureAuthenticated, requestHandler.deleteQuestion);

  app.post('/api/Event', eventCreator.createEvent);
  app.get('/api/Interviews', ensureAuthenticated, requestHandler.listInterviews);

};
