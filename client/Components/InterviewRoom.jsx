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

    // Make sure tabs and side-nav function properly after rendered
    $(document).ready(function(){
        $('ul.tabs').tabs();
        $(".button-collapse").sideNav({
            menuWidth: 400, // Default is 300
            edge: 'right', // Choose the horizontal origin
            closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: false // Choose whether you can drag to open on touch screens
        });
    });
  }

  render() {
    return (
      <div id="interviewPageContainer" className="blue-grey darken-4">
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
                {/* Room info, webcam, roles, participants, session buttons */}
                <div className="col s12 card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Interview Session <span className="new badge red" data-badge-caption="">00:00</span></span>
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

                {/* Home, URL, Record buttons */}
                <div id="interviewerControls" className="col s12 card blue-grey darken-1">
                    <div className="card-content white-text">
                        <Link to='/home'><button id="back" className="btn waves-effect waves-light"><span className="glyphicons glyphicons-home"></span></button></Link>&nbsp;
                        <a id="urlButton" className="btn waves-effect waves-light" target="_blank"><span className="glyphicons glyphicons-link"></span></a>&nbsp;
                        <button id="start" className="btn red darken-4 waves-effect waves-light" onClick={this.start}><span className="glyphicons glyphicons-record"></span></button>
                        <button id="stop" className="btn red darken-4 waves-effect waves-light pulse" onClick={this.stop}><span className="glyphicons glyphicons-stop"></span></button>
                        <button id="save" className="btn green darken-4 waves-effect waves-light" onClick={this.save}><span className="glyphicons glyphicons-disk-save"></span></button>
                    </div>
                </div>
            </div>
        </div>

        {/* Questions Side Nav */}
        <ul id="interviewerQuestionPanel" className="side-nav">
            <li>
                <div className="col s12 collection with-header">
                    <div className="collection-header white-text blue-grey darken-1"><strong>Questions / Prompts</strong></div>
                    <a className="collection-item">
                        <form><p>
                            <input type="checkbox" className="filled-in" id="testQuestion1"></input>
                            <label htmlFor="testQuestion1" className="black-text">Tell me about yourself</label>
                        </p></form>
                    </a>
                    <a className="collection-item">
                        <form><p>
                            <input type="checkbox" className="filled-in" id="testQuestion2"></input>
                            <label htmlFor="testQuestion2" className="black-text">Write a function that does nothing</label>
                        </p></form>
                    </a>
                    <a className="collection-item">
                        <form><p>
                            <input type="checkbox" className="filled-in" id="testQuestion3"></input>
                            <label htmlFor="testQuestion3" className="black-text">What is the difference between you, Potoooooooo, a potato, and a McDonalds French Fry?</label>
                        </p></form>
                    </a>
                </div>
            </li>
        </ul>
        <div id="interviewerQuestionPanelButton" className="fixed-action-btn">
            <a href="#" data-activates="interviewerQuestionPanel" className="button-collapse btn-floating btn-large waves-effect waves-light">
                <span className="glyphicons glyphicons-question-sign"></span>
            </a>
        </div>

      </div>
    );
  }
}

module.exports = InterviewRoom;