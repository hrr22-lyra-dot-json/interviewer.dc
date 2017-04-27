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
var Mixpanel = require('mixpanel');

var mixPanelId = process.env.mixPanelClientId || require('../mixpanel-config.js').clientID;

var mixpanel = Mixpanel.init(mixPanelId);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


var strat = new GoogleStrategy({
    clientID: process.env.clientID || require('../google-config.js').clientID,
    clientSecret: process.env.clientSecret || require('../google-config.js').clientSecret,
    callbackURL: process.env.callbackURL || require('../google-config.js').callbackURL,
    //grant_type: 'authorization_code',
    passReqToCallback   : true,
    accessType: 'offline'
    //   prompt: 'consent',
  },



// // create or update a user in Mixpanel Engage without altering $last_seen
// // - pass option $ignore_time: true to prevent the $last_seen property from being updated
// mixpanel.people.set('billybob', {
//     plan: 'premium',
//     games_played: 1
// }, {
//     $ignore_time: true
// });

// // set a user profile's IP address to get automatic geolocation info
// mixpanel.people.set('billybob', {
//     plan: 'premium',
//     games_played: 1
// }, {
//     $ip: '127.0.0.1'
// });




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
          mixpanel.people.set(profile.id, {
            $first_name: profile.displayName,
            $created: (new Date()).toISOString(),
            $email: profile.email},
            {
            $ip: '127.0.0.1'
          });
          Token.create({
            owner_id: newUser.id,
            token: accessToken,
            refreshToken: refreshToken
          })
          .then(function(newToken) {
            mixpanel.people.set(profile.id, 'token', 'true');
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
                  var tokenToSend = {token: newToken.token}
                  mixpanel.people.set(profile.id, 'folder_id', UpdatedUser.drive_folder_id);
                  done(null, {user: UpdatedUser, token: tokenToSend })
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
            mixpanel.people.set(profile.id, {
              $first_name: profile.displayName,
              $last_login: (new Date()).toISOString(),
              $email: profile.email},                  {
                $ip: '127.0.0.1'
            });
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

//


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

console.log(`[Server + socket.io server port]: ${port}

                          ........:oo:........
                       o//ssssssssyhhysssss+////o                   .'''''''''''''''''.
                 mddmmm/::ddddddddddddddmmmyss::/mmN               |   PARTY OR DIE   |
                 o..+oodddmmmhhhhhhhhhhhdmmmmmdddooy               | ,................'
              h::oyyhddmmm+++///////////++++++mmmddy::s            |/
           Nyyo[[sddhyyyyy::::::::::::::::::::yyymmh//oyym
           h..:oohmm+:://///::::////////////////+mmmmms..sNN
           m++sddmmm+::hddhhy::+ddddddddddddddhhhmmmmmdhh+++d
        Nsssyyhmmhssooodmmhhh::+mmdyyyyyyyyddddddmmmmmmmmo::d
      mmd../mmmmmo::shhdmmhhh::+mmhooooooooyhhmmmmmmmmmmmyssdmm
      +++++smmdddo::///dmmhhh::+mmhooooooooooommmmmddddmmmdd/++m
      ''+hhhmmhoo/:::::oooooossymmhooooooooyyymmdoooooydddmmo//N
      ++:mmmmmy:::::::::::::/yyhmmhooooooooyhhmmd:::::+yyhmmyssddd
      ooommmmmy:::::::::::::://ommhooooooooooommd:::::://shhdmm+..
      yyhmmh++/::::::::::::::::+mmhooooooooyyymmd::::::::/++hmm+//
      dddmmh++/::::::::::::::::+mmhooooooooyhhddh:::::::::::hmmysshhd
      mmmmmdhhs::::::::::::::::+mmhoooooooohhhhhy:::::::::::hmmhhh''+
      mmmmmh++/::::::::::::::::+mmdhhsooooodmm++/:::::::::::hmmsss''+
      dddmmhoo+::::::::::::::::+dddddyssyyydmm::::::::::::::hmmsoo++o
      dddmmdhho::::::::::::::::+hhdmmddddmmmmm::::::::::::::hmmsooNNN
      mmmmmh///::::::::::::::::+hhdmmmmmmmmddd::::::::::::::hmmsoo++/
      yyhmmdss+::::::::::::::::/ooydddmmmmmsoo::::::::::::::yddhyy::+
      ++ommmmmy:::::::::::::::::::ohhdmmddd/::::::::::::::::shhdmmsssNNNmmN
      ..+mmmmmy:::::::::::::::::::://shh+//:::::::::::::::::://dmmmmdoo+..o
      ''+dddmmhss+:::::::::::::::::::+++/::::::::::::::::::::::ooodddhhysshNNy++m
      ''+hhdmmdhhs///:::::::::::::::::::::::::::::::::::::::::::::yyymmmmmmmmo++hNNmdd
      ''+hhdmmdhhhhh+:::::::::::::::::::::::::::::::::::::::::::::::/hhhhhdmmmmmsoo...
      ''+ddmmmdhhhhhyyyyyyyyyyyo:::::::::::::::::::::::::::::::::::::+++++sdddmmdhhsss//+
      ''+mmmmmhsshhhhhhhhhhhhhhy++/:::::::::::::::::::::::::::::::::::::::+ssyyydmmddd///hhd
      ''+mmmmmy::shhhhhhhhhhhhhhhhs:::::::::::::::::::::::::::::::::::::::::::::ymmmmmmmh../
      ''+mmmmmy:://////////////ohhhyy+::::::::::::::::::::::::::::::::::::::::::///hddmmmhhs++s
      ''+mmmmmhssssssssssssssssydddddysssssssssssssssssssssssssssssssssssssssssssssdddmmmmmy::s
      ''+mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmhooh

      [Server + socket.io server port]: ${port}`);
module.exports = app;
