var requestHandler = require('./request-handler.js');

module.exports = function(app) {
  app.post('/api/Meeting', requestHandler.addMeeting);
  app.get('/api/Meetings', requestHandler.listMeetings);
  app.delete('/api/Meeting', requestHandler.deleteMeeting);
  app.post('/api/User', requestHandler.addUser);
  app.post('/api/gmailUser', requestHandler.checkGmailUser);
  app.post('/api/UserMeeting', requestHandler.addUserMeeting);
  // List all rows in the UserMeeting table
  app.get('/api/allUserMeetings', requestHandler.listAllUserMeetings);
  // List all meetings that a specific user is part of
  app.get('/api/UserMeetings', requestHandler.listUserMeetings);
  app.delete('/api/UserMeeting', requestHandler.deleteUserMeeting);
  app.post('/api/Timeslot', requestHandler.addTimeslot);
  app.post('/api/Timeslots', requestHandler.addMultipleTimeslots);
  app.get('/api/allTimeslots', requestHandler.listAllTimeslots);
  app.get('/api/Timeslots', requestHandler.listTimeslots);
  app.delete('/api/Timeslot', requestHandler.deleteTimeslot);

  // Assume link is a meeting link
  //app.get('/*', requestHandler.findMeeting);
};
