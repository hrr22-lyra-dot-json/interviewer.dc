import React from 'react';
import * as helpers from '../Services/interviewHelpers.js';
import * as recorder from '../Services/interviewRecorder.js';
// import * as rtc from '../Services/interviewRtcHandler.js';
// import * as lobby from '../Services/interviewLobby.js';

class InterviewRoom extends React.Component {
  constructor (props) {
    super(props);

    // We will receive from props:
        // lobby name
        // elements to render (white board, codeshare, etc)
        // admin?
    this.disableDefaultButtons.bind(this);
    this.start = recorder.start.bind(this);
    this.stop = recorder.stop.bind(this);
    this.save = recorder.save.bind(this);
  }

  /*
    helpers.getRoomId();
    helpers.showRoomURL();
    helpers.hideRoomURL();
    helpers.disableInputButtons();
    helpers.enableInputButtons();
    helpers.updateCloseLeaveButton(state);
    helpers.setRoomStatusText(str);
    helpers.setUserRoleText(str);

    recorder.initializeRecorder();
    recorder.start();
    recorder.stop();
    recorder.save();
  */

  componentWillMount() {
    console.log('will mount (pre-render)');
  }

  componentDidMount() {
    console.log('did mount (post-render)');
    this.disableDefaultButtons();
    recorder.initializeRecorder();
  }

  disableDefaultButtons() {
    document.getElementById('start').disabled = false;
    document.getElementById('stop').disabled = true;
    document.getElementById('save').disabled = true;
    document.getElementById('close-room').disabled = true;
  }

  render() {
    return (
      <div>
        <div id="elementToShare">
          <header>
            <h2>DEE SEE LOBBEE V3</h2>
            <div id="roomStatusText"></div>
            <div id="userRoleText"></div>
          </header>

          <input type="text" id="room-id"></input>
          <button id="open-room">Open Room</button>
          <button id="join-room">Join Room</button>
          <br /><br />
          <button id="close-room">Waiting for session...</button>

          <div id="videos-container"></div>

        </div>
        <div id="recordControls">
          <button id="start" onClick={this.start}>Start Canvas Recording</button>
          <button id="stop" onClick={this.stop}>Stop</button>
          <button id="save" onClick={this.save}>Save</button>
          <div id="room-urls"></div>
        </div>
      </div>
    );
  }
}

module.exports = InterviewRoom;