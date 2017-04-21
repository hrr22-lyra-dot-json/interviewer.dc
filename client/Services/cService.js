import { EventEmitter } from 'events'
import axios from 'axios'
var util   = require('util');

//var fs = require('fs');


//var google_calendar = new gcal.GoogleCalendar(accessToken);


export default class googleCalendar extends EventEmitter {
  constructor() {
    super()
  }

  getThem() {
    this.getItems(this.gotItems.bind(this))
  }

  gotItems(events) {
      this.emit('events_loaded', events);
  }


  getItems(callback) {//make this into a server post request which adds timeslots then returns them all, much better, more safe, guaranteed token
    var accessToken = JSON.parse(localStorage.getItem('googleUser')).token.token
    var calendarId = 'primary'
    var params = {'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 15,
        'orderBy': 'startTime'
      }
    var url = 'https://www.googleapis.com/calendar/v3/calendars/'+calendarId+'/events'+'?access_token='+ accessToken;

    for(var k in params){
        url += '&'+encodeURIComponent(k)+'='+ encodeURIComponent(params[k]);
      }


    axios.get(url)
    .then(function(data) {
      var events = data.data.items;
      var evss = [];
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
          callback(evss)

        } else {
          //this.appendPre('No upcoming events found.');
        }
      //console.log('err', err)
      console.log('response', data)

    })
  }
}




// 'https://www.googleapis.com/calendar/v3'
// 'GET', '/calendars/'+calendarId+'/events', +'?access_token='+access_token;




// Events.prototype.get = function(calendarId, eventId, option, callback) {

//   if(!callback){ callback = option; option = {}; }

//   calendarId = encodeURIComponent(calendarId);
//   eventId    = encodeURIComponent(eventId);

//   this.request('GET', '/calendars/'+calendarId+'/events/'+eventId,
//     option, {}, null, callback);
// }

// Events.prototype.get = function(calendarId, eventId, option, callback) {

//   if(!callback){ callback = option; option = {}; }

//   calendarId = encodeURIComponent(calendarId);
//   eventId    = encodeURIComponent(eventId);

//   this.request('GET', '/calendars/'+calendarId+'/events/'+eventId,
//     option, {}, null, callback);
// }


// Events.prototype.list = function(calendarId, option, callback) {

//   if(!callback){ callback = option; option = {}; }

//   calendarId = encodeURIComponent(calendarId);

//   this.request('GET', '/calendars/'+calendarId+'/events',
//     option, {}, null, callback);
// }

// function GoogleCalendar(access_token){

//   this.request  = function(type, path, params, options, body, callback) {

//     var url = 'https://www.googleapis.com/calendar/v3'+path+'?access_token='+access_token;

//     params = params || {}
//     options = options || {}
//     options.json = true;

//     type = type.toUpperCase();
//     if(body && typeof body !== 'string') body = JSON.stringify(body);


//     for(var k in params){
//       url += '&'+encodeURIComponent(k)+'='+ encodeURIComponent(params[k]);
//     }

//     needle.request(type, url, body, options, responseHandler);

//     function responseHandler(error, response, body) {
//       if(error) return callback(error, body);
//       if(body.error) return callback(body.error, null);
//       return callback(null, body);
//     }
//   };