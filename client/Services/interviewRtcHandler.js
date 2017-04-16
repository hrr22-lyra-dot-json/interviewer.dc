import * as helpers from './interviewHelpers.js';

/////////////////////////////////////////////////////////////////////////
//////////////////////   RTCMultiConnection Code   //////////////////////
/////////////////////////////////////////////////////////////////////////
var connection = new RTCMultiConnection();

exports.getConnection = function() {
  return connection;
};

exports.initializeConnection = function() {
  console.log(window.location);
  connection.socketURL = '/';
  // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
  // connection.socketURL = window.location.hostname + ':' + socketport + '/';
  // connection.socketURL = 'https://interviewer-dc.herokuapp.com:1337/';

  // Initial connection setup
  connection.socketMessageEvent = 'interviewer.dc-room';
  connection.maxParticipantsAllowed = 3;
  connection.session = {
    audio: true,
    video: true,
    data: true
  };
  connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
  };

  // handling video sources
  connection.videosContainer = document.getElementById('videos-container');
  connection.onstream = function(event) {
    // var width = parseInt(connection.videosContainer.clientWidth / 2) - 20;
    var width = 150;
    var mediaElement = getMediaElement(event.mediaElement, {
      title: event.userid,
      buttons: [],
      width: width,
      showOnMouseEnter: false
    });
    connection.videosContainer.appendChild(mediaElement);

    setTimeout(function() {
      mediaElement.media.play();
    }, 5000);

    mediaElement.id = event.streamid;
  };

  connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
      mediaElement.parentNode.removeChild(mediaElement);
    }
  };

  // Handling session / rooms
  connection.onopen = function() {
    if (!connection.isInitiator) {
      document.getElementById('recordControls').style.display = 'none';
    }
    helpers.updateCloseLeaveButton(connection, false);
    helpers.setRoomStatusText('Connected: ' + connection.getAllParticipants().join(', '));
  };

  connection.onclose = function() {
    // Known bug: the count is always ahead by 1
    // If 2 other people are in room, and one leaves, count will be 2
    // If the last person leaves, count will be 1
    // Events are delayed "1 person"
    // If same person leaves and joins the room, there will be 2 unique instances (one expired, one new)
    if (connection.getAllParticipants().length) {
      helpers.setRoomStatusText('Connected: ' + connection.getAllParticipants().join(', '));
    } else {
      helpers.setRoomStatusText('Connected: (none)');
    }
  };

  connection.onEntireSessionClosed = function(event) {
    helpers.updateCloseLeaveButton(connection, true);
    connection.isInitiator ? helpers.enableInputButtons() : helpers.disableInputButtons();

    connection.attachStreams.forEach(function(stream) {
      stream.stop();
    });

    // don't display alert for moderator
    if (connection.userid === event.userid) {
      return;
    }

    helpers.setRoomStatusText('Session closed by moderator: ' + event.userid);
    helpers.setUserRoleText('');
  };

  // If room already exist
  connection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
    // DEPRECATED / NOT USED ANYMORE
    // seems room is already opened
    connection.join(useridAlreadyTaken);
  };
};

