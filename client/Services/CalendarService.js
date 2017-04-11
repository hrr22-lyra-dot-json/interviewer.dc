import { EventEmitter } from 'events'
//import Auth0Lock from 'auth0-lock'
// Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
var CLIENT_ID = '561574047233-oopf3ll9q5o303cmfdv240cc040coj69.apps.googleusercontent.com'
var SCOPES = ["https://www.googleapis.com/auth/calendar"]

var checkAuth = function(cb) {
  console.log('checkauth');
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, cb) //this.handleAuthResult
}

export default class CalendarService extends EventEmitter {
  constructor() {
    super()
    this.CLIENT_ID = '561574047233-oopf3ll9q5o303cmfdv240cc040coj69.apps.googleusercontent.com';

    this.SCOPES = ["https://www.googleapis.com/auth/calendar"];

    //this.auth = checkAuth(this.handleAuthResult)

    this.state = {events: []}
  }

  checkAuth(cb) {
    console.log('checkauth');
    gapi.auth.authorize({
      'client_id': this.CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, cb); //this.handleAuthResult
  }
  handleAuthResult(authResult) {
    console.log('authresult', authResult);
    var authorizeDiv = document.getElementById('authorize-button');
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      authorizeDiv.style.display = 'none';
      this.loadCalendarApi();
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      authorizeDiv.style.display = 'inline';
    }
  }
  handleAuthClick(event) {
    gapi.auth.authorize(
      {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
      this.handleAuthResult.bind(this));  //return false; .bind(this)
  }
  loadCalendarApi() {
    gapi.client.load('calendar', 'v3', this.listUpcomingEvents.bind(this));
  }
  listUpcomingEvents() {
    var request = gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 15,
      'orderBy': 'startTime'
    })
    var context = this;
    request.execute(function(resp) {
      console.log('resp', resp.items);
      var events = resp.items;
      var evss = [];
      // this.appendPre('The up comming events in your calendar are:'+ '\n'+'\n');
      if (events.length > 0) {
        for (var i = 0; i < events.length; i++) {
          var evv = {
            // 'title': 'sample',
            // 'allDay': true,
            // 'start': new Date(2015, 3, 0),
            // 'end': new Date(2015, 3, 1)
          };

          var event = events[i];
          var when = event.start.dateTime;
          var end = event.end.dateTime;

          if (!when) {
            when = event.start.date;
          }
          if (!end) {
            end = event.end.date;
          }
          evv.start = new Date(when);
          evv.end = new Date(end);
          evv.title = event.summary;
          evss.push(evv);
          //context.emit('events_loaded', evv);
          //module.exports.events.push(evv);
          console.log('evv', evv);
          // this.appendPre(i+1+' '+ event.summary + ' ('+' '+ when +' '+ ')' + '\n');
        }
        context.emit('events_loaded', evss);
      } else {
        //this.appendPre('No upcoming events found.');
      }
    })
  }
  appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }
}








  //     var CLIENT_ID = '561574047233-oopf3ll9q5o303cmfdv240cc040coj69.apps.googleusercontent.com';

  //     var SCOPES = ["https://www.googleapis.com/auth/calendar"];

  //     /*Check the user authentication */

  //     function checkAuth() {
  //       console.log('checkauth');
  //       gapi.auth.authorize(
  //         {
  //           'client_id': CLIENT_ID,
  //           'scope': SCOPES.join(' '),
  //           'immediate': true
  //         }, handleAuthResult);
  //     }

  //     /* function for handling authorozation of server */

  //     function handleAuthResult(authResult) {
  //           console.log(authResult);

  //       var authorizeDiv = document.getElementById('authorize-button');
  //       if (authResult && !authResult.error) {
  //         // Hide auth UI, then load client library.
  //         authorizeDiv.style.display = 'none';
  //         loadCalendarApi();
  //       } else {
  //         // Show auth UI, allowing the user to initiate authorization by
  //         // clicking authorize button.
  //         authorizeDiv.style.display = 'inline';
  //       }
  //     }

  //       /*the response function to user click */

  //   module.exports = {
  //      handleAuthClick: function(event) {
  //       gapi.auth.authorize(
  //         {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
  //         handleAuthResult);
  //       //return false;
  //     },
  //     events:[{
  //       'title': 'All Day Event',
  //       'allDay': true,
  //       'start': new Date(2015, 3, 0),
  //       'end': new Date(2015, 3, 1)
  // }]
  //   }

  //        /*loading client library */

  //     function loadCalendarApi() {
  //       gapi.client.load('calendar', 'v3', listUpcomingEvents);
  //     }


  //     function listUpcomingEvents() {
  //       var request = gapi.client.calendar.events.list({
  //         'calendarId': 'primary',
  //         'timeMin': (new Date()).toISOString(),
  //         'showDeleted': false,
  //         'singleEvents': true,
  //         'maxResults': 15,
  //         'orderBy': 'startTime'
  //       });

  //       request.execute(function(resp) {
  //         console.log('resp', resp.items);
  //         var events = resp.items;
  //         appendPre('The up comming events in your calendar are:'+ '\n'+'\n');



  //         if (events.length > 0) {
  //           for (var i = 0; i < events.length; i++) {
  //             var evv = {
  //               // 'title': 'sample',
  //               // 'allDay': true,
  //               // 'start': new Date(2015, 3, 0),
  //               // 'end': new Date(2015, 3, 1)
  //             };

  //             var event = events[i];
  //             var when = event.start.dateTime;

  //             if (!when) {
  //               when = event.start.date;
  //             }
  //             evv.start = when;
  //             evv.title = event.summary;
  //             // module.exports.events.push(evv);
  //             console.log('evv', evv);
  //             appendPre(i+1+' '+ event.summary + ' ('+' '+ when +' '+ ')' + '\n');
  //           }
  //         } else {
  //           appendPre('No upcoming events found.');
  //         }

  //       });
  //     }

  //         /* this will return the out put to body as its next node */

  //     function appendPre(message) {
  //       var pre = document.getElementById('content');
  //       var textContent = document.createTextNode(message + '\n');
  //       pre.appendChild(textContent);
  //     }