import React from 'react';
import * as recorder from '../Services/interviewRecorder.js';
import * as rtc from '../Services/interviewRtcHandler.js';
import * as lobby from '../Services/interviewLobby.js';
import QuestionService from '../Services/QuestionService.js';
import DrawableCanvas from '../lib/DrawableCanvas.js';
import InterviewService from '../Services/InterviewService.js';
import uploadService from '../Services/UploadService.js';

const interviewService = new InterviewService()
const questionService = new QuestionService()

import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'

window.isRecording = recorder.isRecordingStarted;
window.getBrowser = function() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
        return {name:'IE',version:(tem[1]||'')};
        }
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
}

class InterviewRoom extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
        questionList: [],
        snapshots: [],
        interviewInfo:{}
    }

    console.log('this', this)
    console.log('props', props.location);
    console.log('window', window);

    this.search = props.location.search;
    if (props.location.state === null) {
        // For clients / interviewees
        this.roomid = props.location.search.replace('?roomid=','');
    } else {
        // For interviewers
        this.roomid = props.location.state.split('$')[0];
        this.roomDbId = props.location.state.split('$')[1];
        interviewService.getOne(this.roomid)
    }

    questionService.getThem(this.roomDbId)
    //interviewService.getOne(this.roomid)

    interviewService.on('got_interview', (interview) => {
        this.setState({interviewInfo: interview})
    })

    questionService.on('got_questions', (questions) => {
        // console.log('questions', questions)
        this.setState({questionList: questions})
    })

    // uploads both video and audio blob to google drive folder,
    // takes input object with properties interviewee_name and folder_id
    this.uploadBlobs = recorder.uploadBlobs
    // Basic Recorder Functions
    this.start = recorder.start;
    this.stop = recorder.stop;
    this.save = recorder.save;
    // Lobby Controls
    this.openRoom = lobby.openRoom;
    this.joinRoom = lobby.joinRoom;
    this.closeRoom = lobby.closeRoom;
    // Access to CodeMirror box in the current scope
    this.codeMirror;

    this.uploadService = uploadService.uploadBlobToDrive;
  }

  addQuestion() {
    var question = document.getElementById('newQuestion').value;
    if (question.length > 0) {
        document.getElementById('newQuestion').value = '';
        questionService.addOne({meeting_id: this.roomDbId, question: question})
    }
  }

  showQuestion() {
    console.log(this);
    var currContent = this.context.codeMirror.getValue();
    var preLines = '';
    if (currContent) {
        preLines = '\n\n'
    }
    var newContent = currContent + preLines + '/* \n' + this.q.question + '\n*/\n'
    this.context.codeMirror.setValue(newContent);

    document.getElementById('prompt-text').innerHTML = this.q.question;
  }

  takeScreenSnapshot(e) {
    e.preventDefault();

    var snapshot = {
        question: document.getElementById('prompt-text').innerHTML,
        notes: document.getElementById('questionNote').value,
        codeshare: this.codeMirror.getValue(),
        whiteboard: document.querySelector('#whiteboard canvas').toDataURL(),
        time: document.getElementById('timeElapsed').innerHTML
    };
    console.log(snapshot);
    this.state.snapshots.push(snapshot);

    Materialize.toast(`Screen saved!`, 2000);
  }

  clearScreen(e) {
    e.preventDefault();

    document.getElementById('prompt-text').innerHTML = '(No question selected)';
    document.getElementById('questionNote').value = '';
    this.codeMirror.setValue('');
    document.querySelector('#whiteboard button').click();
  }

  endInterview() {
    // console.log(this);

    var _context = this.context;
    var _type = this.type;

    if (window.isRecording()) {
        Materialize.toast(`Session is still recording! Make sure to stop recording before saving session files`, 2000);
        return;
    }

    // Create PDF from our snapshot data
    var doc = new PDFDocument();
    var stream = doc.pipe(blobStream());
    doc.font('Times-Bold', 20)
       .text(`Interview Notes for session ${_context.roomid}`, {
            align: 'center'
       })
       .moveDown();
    doc.font('Times-Roman', 12)
        .text(`Interview duration: ${document.getElementById('timeElapsed').innerHTML} (Minutes:Seconds)`)
        .moveDown();
    _context.state.snapshots.forEach( (snapshot) => {
        doc.font('Times-Roman', 12)
            .text(`Question: ${snapshot.question} (at ${snapshot.time})`, {
                align: 'left',
                underline: true
            })
            .moveDown();
        doc.font('Times-Roman', 12)
            .text(`Notes: ${snapshot.notes}`)
            .moveDown();
        doc.font('Times-Roman', 12)
            .text('Code:')
            .moveDown();
        doc.font('Courier', 10)
            .text(`${snapshot.codeshare}`, {
                indent: 30
            })
            .moveDown();
        doc.addPage();
        doc.font('Times-Roman', 12)
            .text(`Whiteboard for question "${snapshot.question}"`, {
                align: 'left',
                underline: true
            })
            .moveDown();
        doc.image(snapshot.whiteboard, {
            fit: [400, 400]
        })
            .moveDown();
        doc.addPage();
    });
    doc.font('Times-Bold', 30)
       .text('(End of interview document)', {
            align: 'center'
       });
    doc.end();

    stream.on('finish', function() {
        var pdfblob = stream.toBlob('application/pdf');

        // DOWNLOAD or UPLOAD option routes
        if (_type === 'ul') {
            var info = {interviewee_name: _context.state.interviewInfo.interviewee_name, folder_id: _context.state.interviewInfo.drive_link}
            // Upload video/audio blobs
            _context.uploadBlobs(info)
            // upload pdf files also
            _context.state.snapshots.length > 0 ? _context.uploadService(pdfblob, info) : Materialize.toast('No snapshots saved to upload (PDF)', 2000);

            Materialize.toast('Upload success!', 2000);
        } else {
            // Save session summary pdf
            _context.state.snapshots.length > 0 ? invokeSaveAsDialog(pdfblob, 'Responses (Room ' + _context.roomid + ').pdf') : Materialize.toast('No snapshots saved to download (PDF)', 2000);
            // Save video/audio file
            _context.save();
        }
    });
  }

  componentDidMount() {
    // Detect browser
    var browser = window.getBrowser();
    if (browser.name === 'Chrome' && browser.version === '58') {
        document.getElementById('browserWarning').style.display = 'none';
    }

    // If you click the browser's back button, it will usually cause errors
    // This will act like you are clicking the "home" button
    // window.onpopstate = function() {
    //     window.location.replace(window.location.origin);
    // }

    // Set initial button states
    document.getElementById('stop').style.display = 'none';
    document.getElementById('close-room').style.display = 'none';

    // Auto-fill room name and focus fields temporarily
    document.getElementById('room-id').value = this.roomid;
    document.getElementById('room-id').focus();
    document.getElementById("questionNote").focus();

    // Initialize Recorder functionality and Socket.io connection server
    recorder.initializeRecorder();
    rtc.initializeConnection();
    lobby.initializeLobby();

    // set page title
    document.title = `Room ${this.roomid} | Interviewer Direct Connection`;

    // Load link
    if (this.search) {
      this.joinRoom(this.roomid);
    } else {
      this.openRoom(this.roomid);
    }

    var context = this; //for firepad / codeshare
    $(document).ready(function(){
        // Make sure tabs and side-nav function properly after rendered
        $('ul.tabs').tabs();
        $(".button-collapse").sideNav({
            menuWidth: 450, // Default is 300
            edge: 'right', // Choose the horizontal origin
            closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
            draggable: false // Choose whether you can drag to open on touch screens
        });

        // Setup CodeShare for firepad
        var config = {
            apiKey: 'AIzaSyAA80BaQVSh2mRcw7HWJT7VoJc7zEttlc8',
            authDomain: 'interviewer-direct-connection.firebaseapp.com',
            databaseURL: 'https://interviewer-direct-connection.firebaseio.com'
        };
        firebase.initializeApp(config);
        var firepadRef = firebase.database().ref(context.roomid);
        firepadRef.onDisconnect().remove(function(err) {
            if (err) {console.error(err)}
        });

        var codeMirror = CodeMirror(document.getElementById('codeshare'), {
            mode: 'javascript',
            keymap: 'sublime',
            theme: 'monokai',
            lineNumbers: true
        });

        context.firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {});

        // Make editor available to take values out later
        context.codeMirror = codeMirror;
    });
  }

  componentWillUnmount() {
    console.log('umounted');
    // window.location.replace(window.location.origin);
    document.getElementById('homeButton').click();
  }

  render() {
    return (
      <div id="interviewPageContainer" className="blue-grey darken-4">
        <div className="row">
            <div id="elementToShare" className="col s8 card blue-grey darken-1">
                <div className="row blue-grey z-depth-1">
                    <div id="videos-container"></div>
                </div>

                <div id="codeBoardContainer" className="row blue-grey z-depth-1">
                    <div className="col s12">
                        <ul className="tabs tabs-fixed-width blue-grey">
                            <li className="tab col s6"><a className="active white-text" href="#codeshare">Codeshare</a></li>
                            <li className="tab col s6"><a className="white-text" href="#whiteboard">Whiteboard</a></li>
                        </ul>
                    </div>
                    <div id="codeshare" className="col s12" style={{height: 90 + '%'}}>
                    </div>
                    <DrawableCanvas webrtc={rtc.getConnection()} />
                </div>
            </div>

            <div id="interview-side-panel" className="col s4 right">
                {/* Room info, webcam, roles, participants, session buttons */}
                <div className="col s12 card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Interview Session <span id="timeElapsed" className="new badge red" data-badge-caption="">00:00</span></span>
                        <div id="room-name-container" className="input-field col s12">
                            <input type="text" id="room-id"></input>
                            <label htmlFor="room-id">Room Number</label>
                        </div>

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
                <div id="interviewerControls" className="col s12 blue-grey darken-1">
                    <div className="row">
                        {/*<button id="homeButton" className="col s4 btn waves-effect waves-light" onClick={this.goHome.bind(this)}><span className="glyphicons glyphicons-home"></span></button>*/}
                        <a id="homeButton" href="/" className="col s4 btn waves-effect waves-light"><span className="glyphicons glyphicons-home"></span></a>
                        <a id="urlButton" className="col s4 btn waves-effect waves-light" target="_blank"><span className="glyphicons glyphicons-link"></span></a>
                        <button id="start" className="col s4 btn red darken-4 waves-effect waves-light" onClick={this.start}><span className="glyphicons glyphicons-record"></span></button>
                        <button id="stop" className="col s4 btn red darken-4 waves-effect waves-light pulse" onClick={this.stop}><span className="glyphicons glyphicons-stop"></span></button>
                    </div>
                    <div id="browserWarning" className="row">
                        Video session recording is only compatible with Chrome 58 and above!
                    </div>
                    <hr></hr>
                    <form className="col s12">
                        <div className="row">
                            <div id="promptContainer" className="col s12 blue-grey white-text">
                                <span><strong>Prompt/Question: </strong></span><span id="prompt-text">(No question selected)</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <textarea id="questionNote" className="materialize-textarea" placeholder="Insert notes here..."></textarea>
                                <label htmlFor="questionNote">Question Notes</label>
                            </div>
                        </div>
                        <div className="row">
                            <button id="saveScreen" className="col s6 btn waves-effect waves-light blue" onClick={this.takeScreenSnapshot.bind(this)}><span className="glyphicons glyphicons-log-book"></span>Screenshot</button>
                            <button id="clearScreen" className="col s6 btn waves-effect waves-light blue lighten-2" onClick={this.clearScreen.bind(this)}><span className="glyphicons glyphicons-ban-circle"></span>Clear Screen</button>

                            <li className="divider"></li>

                            <a className="col btn s4 green white-text" onClick={this.endInterview.bind({ context: this, type: 'dl' })}><span className="glyphicons glyphicons-download-alt"></span></a>
                            <a className="col btn s4 yellow darken-3 white-text" onClick={this.endInterview.bind({ context: this, type: 'ul' })}><span className="glyphicons glyphicons-cloud-upload"></span></a>
                            <a id="testClickDrive" className="col btn s4 yellow darken-4 white-text" href={"https://drive.google.com/drive/folders/" + this.state.interviewInfo.drive_link} target="_blank"><span className="social social-google-drive"></span></a>

                            {/*<a className='dropdown-button btn col s12 green' data-activates='sessionFileDropdown' data-hover='true' data-stopPropagation='true' data-outDuration='100' data-inDuration='100'><span className="glyphicons glyphicons-handshake"></span>Session Files</a>
                            <ul id='sessionFileDropdown' className='dropdown-content'>
                                <li className="col s12 green" ><a className="white-text" onClick={this.endInterview.bind({ context: this, type: 'dl' })}><span className="glyphicons glyphicons-download-alt"></span>Download</a></li>
                                <li className="col s12 yellow darken-3"><a className="white-text" onClick={this.endInterview.bind({ context: this, type: 'ul' })}>Upload to Drive</a></li>
                                <li className="col s12 yellow darken-4"><a className="white-text" href={"https://drive.google.com/drive/folders/" + this.state.interviewInfo.drive_link} target="_blank">Open Drive</a></li>
                            <a className="dropdown-button btn col s12 green" href="#" data-activates="endInterview"><span className="glyphicons glyphicons-handshake"></span>End Interview</a>
                            <ul id='endInterview' className='dropdown-content'>
                                <li><a onClick={this.endInterview.bind({ context: this, type: 'dl' })}><span className="glyphicons glyphicons-download-alt"></span>Download</a></li>
                                <li className="divider"></li>
                                <li><a onClick={this.endInterview.bind({ context: this, type: 'ul' })}>Upload to Drive</a></li>
                            </ul>*/}
                        </div>
                    </form>
                </div>
            </div>
        </div>

        {/* Questions Side Nav */}
        <ul id="interviewerQuestionPanel" className="side-nav">
            <li>
                <div className="col s12 collection with-header">
                    <div className="collection-header white-text blue-grey darken-1"><strong>Questions / Prompts</strong></div>
                    {
                        this.state.questionList.map( (q, key) => {
                            return (<a className="collection-item" key={key} onClick={this.showQuestion.bind({context: this, q: q})}>{q.question}</a>)
                        })
                    }
                </div>
            </li>
            <hr></hr>
            <li>
                <form className="col s12">
                    <div className="row">
                        <div className="input-field col s12">
                            <input id="newQuestion" type="text"></input>
                            <label htmlFor="newQuestion">New Question</label>
                        </div>
                    </div>
                    <div className="row">
                        <button id="addQuestion" className="col s12 btn waves-effect waves-light blue" onClick={this.addQuestion.bind(this)}>Add Question</button>
                    </div>
                </form>
            </li>
        </ul>
        <div id="interviewerQuestionPanelButton" className="fixed-action-btn">
            <a href="#" data-activates="interviewerQuestionPanel" className="button-collapse btn-floating btn-large waves-effect waves-light">
                <span className="glyphicons glyphicons-list"></span>
            </a>
        </div>

      </div>
    );
  }
}

module.exports = InterviewRoom;