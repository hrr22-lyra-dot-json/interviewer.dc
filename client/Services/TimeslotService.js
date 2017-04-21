import { EventEmitter } from 'events'
import axios from 'axios'

export default class TimeslotService extends EventEmitter {
  constructor() {
    super()
    //this.user = localStorage.getItem('dbUser');

  }

  addThem(timeslots) {
    this.addSlots(timeslots, this.hasBeenAdded.bind(this), this.getThem.bind(this))
  }

  getThem(userid) {
    this.getSlots(userid, this.gotthem.bind(this))
  }

  createEvent(eventor, slot, owner_id) {
    this.createAnEvent(eventor, this.deleteSlot.bind(this), slot, this.getThem.bind(this), owner_id, this.gotError.bind(this))
  }

  deleteSlot(slotId, callback, owner_id) {
    axios.delete('/api/Timeslot?id=' + slotId)
    .then(function(response) {
      console.log('slot removed')
      callback(owner_id)
    });

  }

  addSlots (timeslots, callback, callback2) {
    axios.post('/api/Timeslots', {
      'timeslots': timeslots
    })
    .then(function (response) {
      console.log('added timeslots', response);
      callback(response)
      callback2(JSON.parse(localStorage.getItem('googleUser')).user.id)
      // this.hasBeenAdded(response).bind(this)
      // this.getSlots(localStorage.getItem('dbUser')).bind(this);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  getSlots(userid, callback) {
    var errorCallback = this.gotError.bind(this)
    axios.get('/api/Timeslots', {
      params: {
        owner_id: userid
      }
    })
    .then(function (response) {
      if (response.data) {
     response.data.forEach(function(slot) {
        slot.start = new Date(slot.start)
        slot.end = new Date(slot.end)
        slot.description = 'timeSlot'
      })

      callback(response)
    } else {
      callback({data:[]})
    }

      //this.gotthem(reponse).bind(this)
    })
    .catch(function (error) {
      console.log(error);
      errorCallback(error)

    });
  }
  hasBeenAdded(slots) {
    this.emit('slots_added', slots)
  }
  gotthem(slots) {
    this.emit('got_slots', slots)
  }
  gotError(error) {
    this.emit('slot_error', error)
  }
  createAnEvent (event, callback, slot, callback2, owner_id, errorCallback) {
    axios.post('/api/Event', event)
    .then(function (response) {
      console.log('added event', response);
      callback(slot.id, callback2, owner_id)
    })
    .catch(function (error) {
      console.log(error);
      errorCallback(error);
    });
  }

}

