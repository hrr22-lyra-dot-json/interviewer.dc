import { EventEmitter } from 'events'
import axios from 'axios'

module.exports = {
  addSlots: function(timeslots) {
    axios.post('/api/Timeslots', {
      timeslots: timeslots
    })
    .then(function (response) {
      console.log('added timeslots', response);
    })
    .catch(function (error) {
      console.log(error);
    });
  },
  getSlots: function(userid) {

    axios.get('/api/Timeslots', {
      params: {
        owner_id: userid
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

