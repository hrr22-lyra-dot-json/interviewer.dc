///////////////////////////////////////////////////////////////
//////////////////////   RECORDER Code   //////////////////////
///////////////////////////////////////////////////////////////
// State variables
var isRecordingStarted = false;
var isStoppedRecording = false;

// Defining the videoRecorder instance and data storage variable
var elementToShare;
var canvas2d;
var context;
var currentVideoBlob;
var canvasRecorder;

// Defining the audioRecorder instance and data storage variable
var audioRecorder;
var currentAudioBlob;

// Constantly checks state of recording/not-recording
var looper = function() {
  if (!isRecordingStarted) {
    return setTimeout(looper, 500);
  }
  html2canvas(elementToShare, {
    grabMouse: false,
    onrendered: function(canvas) {
      context.clearRect(0, 0, canvas2d.width, canvas2d.height);
      context.drawImage(canvas, 0, 0, canvas2d.width, canvas2d.height);

      if (isStoppedRecording) {
        return;
      }

      // setTimeout(looper, 1);
      looper();
    }
  });
};

exports.initializeRecorder = function() {
  // Create canvas area to record
  elementToShare = document.getElementById('elementToShare');
  canvas2d = document.createElement('canvas');
  context = canvas2d.getContext('2d');
  canvas2d.width = elementToShare.clientWidth;
  canvas2d.height = elementToShare.clientHeight;
  canvas2d.style.top = 0;
  canvas2d.style.left = 0;
  canvas2d.style.zIndex = -1;
  canvas2d.style.display = 'none';
  (document.body || document.documentElement).appendChild(canvas2d);

  // videoRecorder
  canvasRecorder = new CanvasRecorder(canvas2d, {
    disableLogs: false,
    // frameInterval: 20,
    initCallback: looper
  });

  // audioRecorder
  navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
    audioRecorder = new MediaStreamRecorder(stream, {
      mimeType: 'audio/webm', // audio/webm or audio/ogg or audio/wav
      bitsPerSecond: 16 * 8 * 1000,
      getNativeBlob: true   // default is false
    });
  }).catch(function(err) {
    console.error('Media Error: ', err);
  });
};

// Button action for "START"
exports.start = function() {
  document.getElementById('start').style.display = 'none';
  document.getElementById('stop').style.display = 'inline';
  document.getElementById('save').disabled = true;

  // Set states
  isStoppedRecording = false;
  isRecordingStarted = true;
  // Reset data
  canvasRecorder.clearRecordedData();
  audioRecorder.clearRecordedData();

  // Start recording
  canvasRecorder.record();
  audioRecorder.record();
};

// Button action "STOP"
exports.stop = function() {
  document.getElementById('stop').style.display = 'none';
  document.getElementById('start').style.display = 'inline';

  isStoppedRecording = true;
  isRecordingStarted = false;

  canvasRecorder.stop(function(vBlob) {
    currentVideoBlob = vBlob;
    audioRecorder.stop(function(aBlob) {
      currentAudioBlob = aBlob;
      document.getElementById('save').disabled = false;

      console.log('VIDEO BLOB', currentVideoBlob);
      console.log('AUDIO BLOB', currentAudioBlob);
    });
  });

  looper();
};

// Button action for "SAVE"
exports.save = function() {
  var date = new Date();
  var formatted = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} (${date.getTime()})`;

  invokeSaveAsDialog(currentVideoBlob, 'DC ' + formatted + '.webm');
  invokeSaveAsDialog(currentAudioBlob, 'DC ' + formatted + '.wav');
};