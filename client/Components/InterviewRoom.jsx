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

  componentDidMount() {
    // Set initial button states
    document.getElementById('stop').style.display = 'none';
    document.getElementById('save').disabled = true;
    document.getElementById('close-room').style.display = 'none';

    // Initialize Recorder functionality and Socket.io connection server
    recorder.initializeRecorder();
    rtc.initializeConnection();
    lobby.initializeLobby();

    // Auto-fill room name
    document.getElementById('room-id').value = this.roomid;

    // set page title
    document.title = `Room ${this.roomid} | Interviewer Direct Connection`;

    // Load link
    if (this.search) {
      this.joinRoom(this.roomid);
    } else {
      this.openRoom(this.roomid);
    }
  }

  render() {
    return (
      <div id="interviewPageContainer" className="blue-grey darken-4">
        <nav className="splash-nav blue darken-3">
          <div className="nav-wrapper">
            <div id="room-urls" className="brand-logo valign-wrapper"></div>
            <ul id="recordControls" className="right">
              <li><button id="start" className="btn red darken-4 waves-effect waves-light" onClick={this.start}><span className="glyphicons glyphicons-record"></span></button></li>
              <li><button id="stop" className="btn red darken-4 waves-effect waves-light pulse" onClick={this.stop}><span className="glyphicons glyphicons-stop"></span></button></li>
              <li><button id="save" className="btn green darken-4 waves-effect waves-light" onClick={this.save}><span className="glyphicons glyphicons-disk-save"></span></button></li>
            </ul>
          </div>
        </nav>

        <div className="row">
            <div id="elementToShare" className="col s8 card blue-grey darken-1">
                <div id="promptContainer" className="card blue-grey">
                    <div className="card-content white-text">
                        <span className="card-title"><strong>Prompt/Question</strong></span>
                        <div id="prompt-text">Waiting for interviewer...</div>
                    </div>
                </div>

                <div id="codeBoardContainer" className="row blue-grey z-depth-1">
                    <div className="col s12">
                        <ul className="tabs tabs-fixed-width blue-grey">
                            <li className="tab col s6"><a className="active white-text" href="#codeshare">Codeshare</a></li>
                            <li className="tab col s6"><a className="white-text" href="#whiteboard">Whiteboard</a></li>
                        </ul>
                    </div>
                    <div id="codeshare" className="col s12">
                        <h1>CODESHARE GOES HERE</h1>
                    </div>
                    <div id="whiteboard" className="col s12">
                        <h1>WHITEBOARD GOES HERE</h1>
                    </div>
                </div>
            </div>

            <div id="interview-side-panel" className="col s4 right">
                <div className="col s12 card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Interview Session</span>

                        <div className="input-field col s12">
                            <input type="text" id="room-id"></input>
                            <label htmlFor="room-id">Room Name</label>
                        </div>

                        <div id="videos-container" className="col s12 block"></div>

                        <div className="chip">
                            <span className="glyphicons glyphicons-lock"></span>
                            <span id="userRoleText"></span>
                        </div>
                        <br/>
                        <div className="chip">
                            <span className="glyphicons glyphicons-group"></span>
                            <span id="roomStatusText"></span>
                        </div>
                    </div>
                    <div className="card-action">
                        <a id="open-room" onClick={this.openRoom}>Open Session</a>
                        <a id="close-room" onClick={this.closeRoom}>Waiting...</a>
                    </div>
                </div>

                <div id="interviewerQuestionPanel" className="col s12 collection with-header blue-grey darken-1">
                    <div className="collection-header white-text blue-grey darken-1"><strong>Questions</strong></div>
                    <a className="collection-item"><span className="badge glyphicons glyphicons-check"></span>Tell me about yourself</a>
                    <a className="collection-item"><span className="badge glyphicons glyphicons glyphicons-unchecked"></span>Write a function that does nothing</a>
                    <br />
                </div>

            </div>
        </div>

      </div>
    );
  }
}

module.exports = InterviewRoom;
