//////////////////////////////////////////////////////////////
/////////////////////  HELPER FUNCTIONS  /////////////////////
//////////////////////////////////////////////////////////////
exports.getRoomId = function() {
  return document.getElementById('room-id').value;
};

// Display/hide URL link for current room (for admins)
exports.showRoomURL = function(roomid) {
  var roomQueryStringURL = '?roomid=' + roomid;
  var fullURL = window.location.href + roomQueryStringURL;

  var html = '<br /><strong>Room URL:</strong>';
  html += '<a href="' + fullURL + '" target="_blank">' + fullURL + '</a>';

  document.getElementById('room-urls').innerHTML = html;
  document.getElementById('room-urls').style.display = 'block';
};

exports.hideRoomURL = function() {
  document.getElementById('roomStatusText').innerHTML = 'Entire session has been closed.';
  document.getElementById('userRoleText').innerHTML = '';
  document.getElementById('room-urls').innerHTML = '';
  document.getElementById('room-urls').style.display = 'none';
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
  document.querySelector('#roomStatusText').innerHTML = str;
};

exports.setUserRoleText = function(str) {
  document.querySelector('#userRoleText').innerHTML = str;
};