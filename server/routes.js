var requestHandler = require('./request-handler.js');

module.exports = function(app) {
  //app.post('/api/Meeting', requestHandler.addMeeting);
  //app.delete('/api/Meeting', requestHandler.deleteMeeting);
  app.post('/api/User', requestHandler.addUser);
  app.post('/api/UserMeeting', requestHandler.addUserMeeting);
  // List all rows in the UserMeeting table
  app.get('/api/allUserMeetings', requestHandler.listAllUserMeetings);
  // List all meetings that a specific user is part of
  app.get('/api/UserMeetings', requestHandler.listUserMeetings);
  app.delete('/api/UserMeeting', requestHandler.deleteUserMeeting);
  // Assume link is a meeting link
  //app.get('/*', requestHandler.findMeeting);
};
