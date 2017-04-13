//////////////////////////////////////////////////////////////
/////////////////////  HELPER FUNCTIONS  /////////////////////
//////////////////////////////////////////////////////////////
exports.getRoomId = function() {
  return document.getElementById('room-id').value;
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
  document.getElementById('roomStatusText').innerHTML = 'Entire session has been closed.';
  document.getElementById('userRoleText').innerHTML = '';
  document.getElementById('room-urls').innerHTML = '';
};

// helper functions to disable/enable all buttons
exports.disableInputButtons = function() {
  document.getElementById('open-room').disabled = true;
  document.getElementById('join-room').disabled = true;
  document.getElementById('room-id').disabled = true;
};

exports.enableInputButtons = function() {
  document.getElementById('open-room').disabled = false;
  document.getElementById('join-room').disabled = false;
  document.getElementById('room-id').disabled = false;
};

// Helper function to change text of leave/close room based on role
exports.updateCloseLeaveButton = function(connection, state){
  document.getElementById('close-room').disabled = state;

  if (connection.isInitiator) {
    document.getElementById('close-room').innerText = 'Close Room';
  } else {
    document.getElementById('close-room').innerText = 'Leave Room';
  }
};

// Change text on screen
exports.setRoomStatusText = function(str) {
  document.getElementById('roomStatusText').innerHTML = str;
};

exports.setUserRoleText = function(str) {
  document.getElementById('userRoleText').innerHTML = str;
};