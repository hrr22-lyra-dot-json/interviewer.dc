//////////////////////////////////////////////////////////////
/////////////////////  HELPER FUNCTIONS  /////////////////////
//////////////////////////////////////////////////////////////
exports.getRoomId = function() {
  return document.getElementById('room-id').value;
};

exports.validateRoomid = function(roomid) {
  if (typeof roomid === 'string') {
    document.getElementById('room-id').value = roomid;
    return roomid;
  } else {
    return exports.getRoomId();
  }
};

// Display/hide URL link for current room (for admins)
exports.showRoomURL = function(roomid) {
  var roomQueryStringURL = '?roomid=' + roomid;
  // var fullURL = window.location.href + roomQueryStringURL;
  var fullURL = window.location.href.split('?_k=').shift() + roomQueryStringURL;
  var html = '<u><a href="' + fullURL + '" target="_blank">' + roomid + '</a></u>';
  // var html = '<u><a href="' + window.location.href + '" target="_blank">' + roomid + '</a></u>';
  // var html = '<u><a href="' + window.location.href.split('?_k=').shift() + '" target="_blank">' + roomid + '</a></u>';

  document.getElementById('room-urls').innerHTML = html;
};

exports.hideRoomURL = function() {
  exports.setRoomStatusText('Entire session has been closed.');
  document.getElementById('room-urls').innerHTML = '';
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
  document.getElementById('room-id').style.display = 'none';
  document.getElementById('interviewerQuestionPanel').style.display = 'none';
};

// helper functions to disable/enable all buttons
exports.disableInputButtons = function() {
  document.getElementById('open-room').style.display = 'none';
  // document.getElementById('join-room').disabled = true;
  document.getElementById('room-id').disabled = true;
};

exports.enableInputButtons = function() {
  document.getElementById('open-room').style.display = 'inline';
  // document.getElementById('join-room').disabled = false;
  document.getElementById('room-id').disabled = false;
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