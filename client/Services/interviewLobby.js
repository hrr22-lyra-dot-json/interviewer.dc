import * as helpers from './interviewHelpers.js';
import { getConnection } from './interviewRtcHandler.js';

/////////////////////////////////////////////////////////////////
//////////////////////   BUTTON HANDLERS   //////////////////////
/////////////////////////////////////////////////////////////////
var connection = getConnection();

exports.openRoom = function() {
  // document.getElementById('room-id') = PARAMS.ROOMID;
  // connection.open(PARAMS.ROOMID, function() {
  connection.open(helpers.getRoomId(), function() {
    helpers.disableInputButtons();
    helpers.updateCloseLeaveButton(connection, false);
    helpers.showRoomURL(connection.sessionid);

    helpers.setUserRoleText('IS YOU THE ADMIN? ' + connection.isInitiator);
    helpers.setRoomStatusText('Waiting for participant(s) to join');
  });
};

exports.joinRoom = function() {
  connection.checkPresence(helpers.getRoomId(), function(isRoomExist, roomid) {
    helpers.disableInputButtons();
    helpers.updateCloseLeaveButton(connection, true);

    if (isRoomExist) {
      connection.join(roomid, function() {
        helpers.setUserRoleText('IS YOU THE ADMIN? ' + connection.isInitiator);
      });
    } else {
      helpers.enableInputButtons();
      helpers.setRoomStatusText('Room does not exist!');
    }
  });
};

exports.closeRoom = function() {
  helpers.updateCloseLeaveButton(connection, true);

  if (connection.isInitiator) {
    connection.closeEntireSession(function() {
      helpers.hideRoomURL();
    });
  } else {
    connection.leave();
    connection.close();
  }
};

//////////////////////////////////////////////////////////////
/////////////////////  HANDLING ROOM ID  /////////////////////
//////////////////////////////////////////////////////////////
(function roomParams() {
  var params = {};

  // LEGACY REGEX CODE
  // var r = /([^&=]+)=?([^&]*)/g;
  // var d = function(s) {
  //   return decodeURIComponent(s.replace(/\+/g, ' '));
  // };
  // var match;
  // var search = window.location.search;   // this SHOULD be showing: "?roomid=xxxxxxx"
  // while (match = r.exec(search.substring(1))) {
  //   params[d(match[1])] = d(match[2]);
  // }

  // https://developer.mozilla.org/en-US/docs/Web/API/Location
  // New workaround code
  var href = window.location.href;
  if (href.indexOf('?roomid=') !== -1) {
    var split = href.split('?roomid=');
    params['roomid'] = split[split.length - 1];
  }
  window.params = params;
})();

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
    document.getElementById('room-id').value = roomid;
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