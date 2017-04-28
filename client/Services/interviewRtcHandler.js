import * as helpers from './interviewHelpers.js';

/////////////////////////////////////////////////////////////////////////
//////////////////////   RTCMultiConnection Code   //////////////////////
/////////////////////////////////////////////////////////////////////////
var connection = new RTCMultiConnection();

exports.getConnection = function() {
  return connection;
};

exports.initializeConnection = function() {
  connection.socketURL = '/';

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
    var width = 140;
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
    helpers.updateCloseLeaveButton(connection, false);
    helpers.setRoomStatusText('Connected: ' + connection.getAllParticipants().join(', '));
  };

  connection.onclose = function() {
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

