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
    document.getElementById('stop').style.display = 'none';
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
        <nav className="splash-nav blue darken-3">
          <div className="nav-wrapper">
            <div id="room-urls" className="brand-logo center"></div>
            <ul id="recordControls" className="right">
              <li><button id="start" className="btn red darken-4 waves-effect waves-light" onClick={this.start}><span className="glyphicons glyphicons-record"></span></button></li>
              <li><button id="stop" className="btn red darken-4 waves-effect waves-light pulse" onClick={this.stop}><span className="glyphicons glyphicons-stop"></span></button></li>
              <li><button id="save" className="btn green darken-4 waves-effect waves-light" onClick={this.save}><span className="glyphicons glyphicons-disk-save"></span></button></li>
            </ul>
          </div>
        </nav>

        <div className="row">
          <div id="elementToShare" className="col s8">
            <div id="prompt-container" className="col s12 m8">QUESTIONS OR PROMPTS MAY APPEAR IN THIS TOP BAR</div>
            <div className="col s12">
              <ul className="tabs tabs-fixed-width">
                <li className="tab col s6"><a className="active" href="#test1">Test 1</a></li>
                <li className="tab col s6"><a href="#test2">Test 2</a></li>
              </ul>
            </div>
            <div id="test1" className="col s12">
                THIS IS GOING TO BE WHERE THE CODESHARE GOES
            </div>
            <div id="test2" className="col s12">
                THIS IS WHERE THE WHITEBOARD WILL GO
            </div>
          </div>

          <div id="interviewer-control" className="col s4">
            <div id="videos-container" className="col s12"></div>
            Room Name: <div className="input-field inline"><input type="text" id="room-id"></input></div><br/>
            <button id="open-room" className="btn z-depth-2" onClick={this.openRoom}>Open</button>
            <button id="join-room" className="btn z-depth-2" onClick={this.joinRoom}>Join</button>
            <button id="close-room" className="btn z-depth-2" onClick={this.closeRoom}>Waiting...</button><br/><br/>
            <div id="roomStatusText"></div><br/>
            <div id="userRoleText" className="chip"></div>
          </div>
        </div>

      </div>
    );
  }
}

module.exports = InterviewRoom;