const express = require('express');
const passport = require('passport');
const util             = require( 'util' )
const Strategy = require('passport-google-oauth2').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore       = require( 'connect-redis' )( session )
const User = require('./database/models').User;
const Token = require('./database/models').Token;


// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.

// exports.checkGmailUser = function(req, res) {
//   User.findOrCreate({where: {email: req.body.email}, defaults: {username: req.body.username}})
//   .spread(function(newUser, created) {
//     if (created) {
//       res.status(201).send(newUser);
//     } else {
//       res.status(200).send(newUser);
//     }
//   }).catch(function(err) {
//     console.error(err);
//     res.status(500).send(err);
//   });
// };

// xports.updateToken = function(req, res) {
//   Token.findOrCreate({where: {owner_id: req.body.owner_id}, defaults: {token: req.body.token}})
//   .spread(function(newToken, created) {
//     if (!created) {
//       return newToken.update({token: req.body.token});
//     }
//   }).then(function() {
//     res.status(201).send();
//   }).catch(function(err) {
//     console.error(err);
//     res.status(500).send(err);
//   });
// };


//////////////////////
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new Strategy({
    clientID: '570801003952-9ss0c74s14sbjuof8qlmup8fd6dd4t3k.apps.googleusercontent.com',
    clientSecret: 'nhrAFAbgiAP8eoPtJUAvtLd-',
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log('theprofile', profile)
    process.nextTick(function () {

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
    // console.log('argumentos', arguments)
    // User.findOne({
    //   where: { googleId: profile.id}
    // })
    // .then(function(foundUser) {
    //   if (!foundUser) {
    //     User.create({
    //       googleId: profile.id,
    //       username: profile.displayName,
    //       email: profile.email,
    //       photoUrl: profile.image.url
    //     })
    //     .then(function(newUser) {
    //       Token.create({
    //         owner_id: newUser.id,
    //         token: accessToken,
    //         refreshToken: refreshToken
    //       })

    //     })
    //   }




    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    //process.nextTick(function () {

      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      //return done(null, profile);
    //});
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
// passport.serializeUser(function(user, cb) {
//   cb(null, user);
// });

// passport.deserializeUser(function(obj, cb) {
//   cb(null, obj);
// });



const bodyParser = require('body-parser');
const morgan = require('morgan');
var path = require('path');

// Create a new Express application.
const app = express();

// Configure view engine to render EJS templates.
//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

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
//   //proxy:  true,
//     resave: true,
//     saveUninitialized: true
// }));

// // Initialize Passport and restore authentication state, if any, from the
// // session.
// app.use(passport.initialize());
// app.use(passport.session());


// Define routes.
// app.get('/',
//   function(req, res) {
//     res.render('home', { user: req.user });
//   });

// app.get('/login',
//   function(req, res){
//     res.render('login');
//   });

app.get('/auth/google', passport.authenticate('google', { scope: [
       'https://www.googleapis.com/auth/plus.login',
       'https://www.googleapis.com/auth/plus.profile.emails.read',
       "https://www.googleapis.com/auth/calendar"]
}));

app.get( '/auth/google/callback',
      passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/'
}));




app.get('/logged-in',
  ensureAuthenticated,
  function(req, res){
    console.log('dbuser', req.user)
    res.json({user: req.user});
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/#/login');
});

app.listen(3000);

function ensureAuthenticated(req, res, next) {
  console.log('isauthed', req.user)
  if (req.isAuthenticated()) { console.log('isauthed', req.user);
  return next(); }
  res.redirect('/');
}
