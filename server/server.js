const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
var path = require('path');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../')));

// Routes
require('./routes.js')(app);

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`Listening on port: ${port}`);

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SOCKET IO SERVER ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// socket.io server configuration based on Muaz Khan's server for WebRTC
/*
 * Environment variables
 *   SOCKETIO_PORT (default: 443)
 *   USE_HTTPS (default: false)
*/

// HTTPS Check
var isUseHTTPs = false;
var fs = require('fs');
var path = require('path');

// Platform check
var resolveURL = function(url) {
  var isWin = !!process.platform.match(/^win/);
  if (!isWin) return url;
  return url.replace(/\//g, '\\');
};

// HTTPS options - see how to use a valid certificate: // https://github.com/muaz-khan/WebRTC-Experiment/issues/62
var httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, resolveURL('socket.io/fake-keys/privatekey.pem'))),
  cert: fs.readFileSync(path.join(__dirname, resolveURL('socket.io/fake-keys/certificate.pem')))
};

// Main server setup
var http = require(isUseHTTPs ? 'https' : 'http');
var socketserver;
var socketport = process.env.SOCKETIO_PORT || 443;

isUseHTTPs ? socketserver = http.createServer(httpsOptions, app) : socketserver = http.createServer(app);
socketserver = socketserver.listen(socketport);

// Socket config
require('./socket.io/Signaling-Server.js')(socketserver, function(socket) {
  try {
    var params = socket.handshake.query;
    // "socket" object is totally in your own hands! Do whatever you want!
    // In your HTML page, you can access socket as following:
      // connection.socketCustomEvent = 'custom-message';
      // var socket = connection.getSocket();
      // socket.emit(connection.socketCustomEvent, { test: true });
    if (!params.socketCustomEvent) params.socketCustomEvent = 'custom-message';
    socket.on(params.socketCustomEvent, function(message) {
      try {
        socket.broadcast.emit(params.socketCustomEvent, message);
      } catch (e) {}
    });
  } catch (e) {}
});

console.log('[socket.io server port]: ' + socketport);