// import { EventEmitter } from 'events'
// //import Auth0Lock from 'auth0-lock'
// // Your Client ID can be retrieved from your project in the Google
//       // Developer Console, https://console.developers.google.com
// // var CLIENT_ID = '561574047233-oopf3ll9q5o303cmfdv240cc040coj69.apps.googleusercontent.com'
// // var SCOPES = ["https://www.googleapis.com/auth/calendar"]

// // var checkAuth = function(cb) {
// //   console.log('checkauth');
// //   gapi.auth.authorize({
// //     'client_id': CLIENT_ID,
// //     'scope': SCOPES.join(' '),
// //     'immediate': true
// //   }, cb) //this.handleAuthResult
// // }

// export default class CalendarService extends EventEmitter {
//   constructor() {
//     super()
//     this.CLIENT_ID = '561574047233-oopf3ll9q5o303cmfdv240cc040coj69.apps.googleusercontent.com';

//     this.SCOPES = ["https://www.googleapis.com/auth/calendar"];

//     //this.auth = checkAuth(this.handleAuthResult)

//     this.state = {events: []}
//   }
