import React from 'react';

class InterviewRoom extends React.Component {
  constructor (props) {
    super(props);

    // We will receive from props:
        // lobby name
        // elements to render (white board, codeshare, etc)
        // admin?

    this.startRecording.bind(this);
    this.stopRecording.bind(this);
    this.saveRecording.bind(this);
  }

  componentWillMount() {
    console.log('will mount (pre-render)');
  }

  componentDidMount() {
    console.log('did mount (post-render)');
  }

  startRecording() {
    console.log('started');
  }

  stopRecording() {
    console.log('stopped');
  }

  saveRecording() {
    console.log('saved');
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
          <button id="close-room" disabled>Waiting for session...</button>

          <div id="videos-container"></div>

        </div>
        <div id="recordControls">
          <button id="start" onClick={this.startRecording}>Start Canvas Recording</button>
          <button id="stop" disabled>Stop</button>
          <button id="save" disabled>Processes &amp; Save</button>
          <div id="room-urls"></div>
        </div>

        <script src="../Services/interviewHelpers.js"></script>
        <script src="../Services/interviewRecorder.js"></script>
        <script src="../Services/interviewRtcHandler.js"></script>
        <script src="../Services/interviewLobby.js"></script>
      </div>
    );
  }
}

module.exports = InterviewRoom;