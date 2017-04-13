import React from 'react';
import * as recorder from '../Services/interviewRecorder.js';
import * as rtc from '../Services/interviewRtcHandler.js';
import * as lobby from '../Services/interviewLobby.js';
import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'


class InterviewRoom extends React.Component {
  constructor (props) {
    super(props);

    console.log('this', this)
    console.log('props', props.location);
    // this.roomid = props.location.search.replace('?roomid=', '');
    this.search = props.location.search;
    this.roomid = props.location.state;

    this.start = recorder.start;
    this.stop = recorder.stop;
    this.save = recorder.save;
    this.openRoom = lobby.openRoom;
    this.joinRoom = lobby.joinRoom;
    this.closeRoom = lobby.closeRoom;
  }

  componentWillMount() {
    console.log('will mount (pre-render)');
  }

  componentDidMount() {
    console.log('did mount (post-render)');

    // Set initial button states
    document.getElementById('start').disabled = false;
    document.getElementById('stop').disabled = true;
    document.getElementById('save').disabled = true;
    document.getElementById('close-room').disabled = true;

    // Initialize Recorder functionality and Socket.io connection server
    recorder.initializeRecorder();
    rtc.initializeConnection();
    lobby.initializeLobby();

    // Auto-fill room name
    document.getElementById('room-id').value = this.roomid;

    // Load link
    if (this.search) {
      this.joinRoom(this.roomid);
    } else {
      this.openRoom(this.roomid);
    }
  }

  render() {
    return (
      <div>
        <nav className="splash-nav">
          <div className="nav-wrapper">
            <div id="room-urls" className="brand-logo center"></div>
            <ul id="recordControls" className="right">
              <li><button id="start" className="btn btn-default z-depth-2 red" onClick={this.start}>Start Recording</button></li>
              <li><button id="stop" className="btn btn-default z-depth-2" onClick={this.stop}>Stop</button></li>
              <li><button id="save" className="btn btn-default z-depth-2" onClick={this.save}>Save</button></li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <div className="row">
            <input type="text" id="room-id"></input>
            <button id="open-room" className="btn btn-default z-depth-2" onClick={this.openRoom}>Open Room</button>
            <button id="join-room" className="btn btn-default z-depth-2" onClick={this.joinRoom}>Join Room</button>
            <button id="close-room" className="btn btn-default z-depth-2" onClick={this.closeRoom}>Waiting for session...</button>
            <div id="elementToShare" className="col s12">
              <div id="videos-container" className="video-container"></div>
            </div>
          </div>
          <div className="row">
            <div className="col s12 m12">
              <div id="roomStatusText"></div>
              <div id="userRoleText"></div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

module.exports = InterviewRoom;