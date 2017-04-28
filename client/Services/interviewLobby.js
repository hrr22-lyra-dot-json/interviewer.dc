import * as helpers from './interviewHelpers.js';
import { getConnection } from './interviewRtcHandler.js';

/////////////////////////////////////////////////////////////////
//////////////////////   BUTTON HANDLERS   //////////////////////
/////////////////////////////////////////////////////////////////
var connection = getConnection();

exports.openRoom = function(roomid) {
  roomid = helpers.validateRoomid(roomid);

  connection.open(roomid, function() {
    helpers.disableInputButtons();
    helpers.updateCloseLeaveButton(connection, false);
    helpers.showRoomURL(connection.sessionid);
    helpers.showRole();

    connection.isInitiator ? helpers.setUserRoleText('Role: ADMIN') : helpers.setUserRoleText('Role: CLIENT');
    helpers.setRoomStatusText('Waiting for participant(s) to join');
  });
};

exports.joinRoom = function(roomid) {
  roomid = helpers.validateRoomid(roomid);

  connection.join(roomid, function() {
    helpers.disableInputButtons();
    helpers.updateCloseLeaveButton(connection, false);
    helpers.restrictClientElements();
    connection.isInitiator ? helpers.setUserRoleText('Role: ADMIN') : helpers.setUserRoleText('Role: CLIENT');
  });
};

exports.closeRoom = function() {
  helpers.updateCloseLeaveButton(connection, true);

  if (connection.isInitiator) {
    connection.closeEntireSession(function() {
      helpers.hideRoomURL();
      helpers.hideRole();
    });
  } else {
    connection.leave();
    connection.close();
  }
};

//////////////////////////////////////////////////////////////
/////////////////////  HANDLING ROOM ID  /////////////////////
//////////////////////////////////////////////////////////////
var roomParams = function() {
  var params = {};

  // Workaround code v3
  var href = window.location.href.split('&_k=').shift().split('?roomid=').pop();
  params['roomid'] = href;
  // console.log('new href', href);

  window.params = params;
};
roomParams();

var roomid = '';

exports.initializeLobby = function() {
  if (localStorage.getItem(connection.socketMessageEvent)) {
    // roomid = localStorage.getItem(connection.socketMessageEvent);
    roomid = 'default-room-name';
  } else {
    roomid = connection.token();
  }

  var roomidElement = document.getElementById('room-id');
  roomidElement.value = roomid;
  roomidElement.onkeyup = function() {
    localStorage.setItem(connection.socketMessageEvent, roomidElement.value);
  };

  roomid = params.roomid;

  if (roomid && roomid.length) {
    document.getElementById('room-id').innerHTML = roomid;
    localStorage.setItem(connection.socketMessageEvent, roomid);
    // auto-join-room
    (function reCheckRoomPresence() {
      connection.checkPresence(roomid, function(isRoomExists) {
        if (isRoomExists) {
          connection.join(roomid);
          return;
        }
        setTimeout(reCheckRoomPresence, 5000);
      });
    })();

    helpers.disableInputButtons();
  }
};