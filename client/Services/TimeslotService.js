import { EventEmitter } from 'events'
import axios from 'axios'

module.exports = {
  addSlot: function(timeslot) {
    axios.post('/api/timeSlot', {
      start: user.name,
      end: user.email
      userid:
    })
    .then(function (response) {
      console.log('added timeslot', response);
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  getSlots: function(useremail) {

    axios.get('/api/timeSlot', {
      params: {
        ID: useremail
      }
    })
    .then(function (response) {
      console.log('got slots', response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}

