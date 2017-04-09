// Your Client ID can be retrieved from your project in the Google
      // Developer Console, https://console.developers.google.com
      var CLIENT_ID = '561574047233-oopf3ll9q5o303cmfdv240cc040coj69.apps.googleusercontent.com';

      var SCOPES = ["https://www.googleapis.com/auth/calendar"];

      /*Check the user authentication */

      function checkAuth() {
        console.log('checkauth');
        gapi.auth.authorize(
          {
            'client_id': CLIENT_ID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      }

      /* function for handling authorozation of server */

      function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-button');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          loadCalendarApi();
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
      }

        /*the response function to user click */

    module.exports = {
       handleAuthClick: function(event) {
        gapi.auth.authorize(
          {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
          handleAuthResult);
        //return false;
      }
    }

         /*loading client library */

      function loadCalendarApi() {
        gapi.client.load('calendar', 'v3', listUpcomingEvents);
      }

           /*print out the results of users calendar response*/

      function listUpcomingEvents() {
        var request = gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 15,
          'orderBy': 'startTime'
        });

        request.execute(function(resp) {
          console.log('resp', resp.items);
          var events = resp.items;
          appendPre('The up comming events in your calendar are:'+ '\n'+'\n');



          if (events.length > 0) {
            for (var i = 0; i < events.length; i++) {

              var event = events[i];
              var when = event.start.dateTime;

              if (!when) {
                when = event.start.date;
              }
              appendPre(i+1+' '+ event.summary + ' ('+' '+ when +' '+ ')' + '\n');
            }
          } else {
            appendPre('No upcoming events found.');
          }

        });
      }

          /* this will return the out put to body as its next node */

      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }