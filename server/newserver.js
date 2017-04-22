const express = require('express');
const passport = require('passport');
const util             = require( 'util' )
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore       = require( 'connect-redis' )( session )
const User = require('./database/models').User;
const Token = require('./database/models').Token;
const refresh = require('passport-oauth2-refresh')
var google = require('googleapis');
var googleAuth = require('google-auth-library');


//////////////////////
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


var strat = new GoogleStrategy({
    clientID: process.env.clientID || '570801003952-9ss0c74s14sbjuof8qlmup8fd6dd4t3k.apps.googleusercontent.com',
    clientSecret: process.env.clientSecret || 'nhrAFAbgiAP8eoPtJUAvtLd-',
    callbackURL: process.env.callbackURL || 'http://localhost:3000/auth/google/callback',
    //grant_type: 'authorization_code',
    passReqToCallback   : true,
    accessType: 'offline'
    //   prompt: 'consent',
  },




  function(request, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
          console.log('refresher', refreshToken);
    User.findOne({
      where: { googleId: profile.id}
    })
    .then(function(foundUser) {
      if (!foundUser) {
        User.create({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.email
        })
        .then(function(newUser) {
          Token.create({
            owner_id: newUser.id,
            token: accessToken,
            refreshToken: refreshToken
          })
          .then(function(newToken) {
            var auth = new google.auth.OAuth2;
            auth.setCredentials({
              access_token: newToken.token,
              refresh_token: newToken.refreshToken
            });
            var drive = google.drive('v3');
            var fileMetadata = {
              'name' : 'InterviewerDC',
              'mimeType' : 'application/vnd.google-apps.folder'
            };
            drive.files.create({
              auth: auth,
              resource: fileMetadata,
              fields: 'id'
            }, function(err, file) {
              if (err) {
                console.log('The API failed to create folder error: ' + err);
              } else {
                newUser.update({drive_folder_id:file.id})
                .then(function(UpdatedUser) {
                  done(null, {user: UpdatedUser, token: newToken })
                })
              }
            })
          })
        })
      } else {
        Token.find({where:{owner_id: foundUser.id}})
        .then(function(foundToken) {
          foundToken.update({token: accessToken, refreshToken: refreshToken})
          .then(function(updatedToken) {
            console.log('newtok', updatedToken)
            var tokenToSend = {token: updatedToken.token}
            done(null, {user: foundUser, token: tokenToSend })
          });
        })

      }
    })
  })
 })
passport.use(strat);
refresh.use(strat);

const bodyParser = require('body-parser');
const morgan = require('morgan');
var path = require('path');

// Create a new Express application.
const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static(path.join(__dirname, '../')));

app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../')));


// app.use( session({
//   secret: 'cookie_secret',
//   name:   'kaas',
//   store:  new RedisStore({
//     host: '127.0.0.1',
//     port: 6379
//   }),
//     proxy:  true,
//     resave: true,
//     saveUninitialized: true
// }));

/


app.get('/auth/google', passport.authenticate('google', { scope: [
       'https://www.googleapis.com/auth/plus.login',
       'https://www.googleapis.com/auth/plus.profile.emails.read',
       "https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/drive.file"], accessType: 'offline',
       approvalPrompt: 'force'
}));

app.get( '/auth/google/callback',
      passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/'
}));




app.get('/logged-in',
  ensureAuthenticated,
  function(req, res){
    //console.log('dbuser', req.user)
    res.json({user: req.user});
  });
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/', ensureAuthenticated, function(req, res){
  res.redirect('/');
  res.json({user: req.user})
});
require('./routes.js')(app);


function ensureAuthenticated(req, res, next) {
  console.log('isauthed', req.user)
  if (req.isAuthenticated()) { console.log('isauthed', req.user);
  return next(); }
  res.redirect('/');
}

var isUseHTTPs = process.env.USE_HTTPS || false;
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
const port = process.env.PORT || 3000;
var socketserver;
isUseHTTPs ? socketserver = http.createServer(httpsOptions, app) : socketserver = http.createServer(app);
socketserver = socketserver.listen(port);

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

//////////////////////////////////////////////////////////////////////
//////////////////////////////// MISC ////////////////////////////////
//////////////////////////////////////////////////////////////////////

console.log('[Server + socket.io server port]: ' + port);
module.exports = app;

