//////////////////////////////////////////////////////////////
/////////////////////  HELPER FUNCTIONS  /////////////////////
//////////////////////////////////////////////////////////////

// Get room id of current page
exports.getRoomId = function() {
  return document.getElementById('room-id').innerHTML;
};

exports.validateRoomid = function(roomid) {
  if (typeof roomid === 'string') {
    document.getElementById('room-id').innerHTML = roomid;
    return roomid;
  } else {
    return exports.getRoomId();
  }
};

// Display/hide URL link for current room (for admins)
exports.showRoomURL = function(roomid) {
  var roomQueryStringURL = '?roomid=' + roomid;
  var fullURL = window.location.href.split('?_k=').shift() + roomQueryStringURL;
  var html = '<u><a href="' + fullURL + '" target="_blank">Full Room URL</a></u>';

  // Enable room url link button
  document.getElementById('urlButton').href = fullURL;
};

exports.hideRoomURL = function() {
  exports.setRoomStatusText('Entire session has been closed.');

  // Disable room url link button
  document.getElementById('urlButton').removeAttribute('href');
};

// Show/hide user role when they join/leave the room
exports.showRole = function() {
  document.getElementById('userRoleText').style.display = 'inline';
};

exports.hideRole = function() {
  document.getElementById('userRoleText').style.display = 'none';
};

// Additional page elements to hide from client
exports.restrictClientElements = function() {
  document.getElementById('room-name-container').style.display = 'none';
  document.getElementById('promptContainer').style.display = 'none';
  document.getElementById('interviewerControls').style.display = 'none';
  document.getElementById('interviewerQuestionPanel').style.display = 'none';
  document.getElementById('interviewerQuestionPanelButton').style.display = 'none';
  document.querySelector('#whiteboard #clearButton').style.display = 'none';
};

// helper functions to disable/enable all buttons
exports.disableInputButtons = function() {
  document.getElementById('open-room').style.display = 'none';
};

exports.enableInputButtons = function() {
  document.getElementById('open-room').style.display = 'inline';
};

// Helper function to change text of leave/close room based on role
exports.updateCloseLeaveButton = function(connection, state) {
  if (state) {
    document.getElementById('close-room').style.display = 'none';
  } else {
    document.getElementById('close-room').style.display = 'inline';
  }

  if (connection.isInitiator) {
    document.getElementById('close-room').innerText = 'Close Session';
  } else {
    document.getElementById('close-room').innerText = 'Leave Session';
  }
};

// Change text on screen
exports.setRoomStatusText = function(str) {
  document.getElementById('roomStatusText').innerHTML = str;
};

exports.setUserRoleText = function(str) {
  document.getElementById('userRoleText').innerHTML = str;
};