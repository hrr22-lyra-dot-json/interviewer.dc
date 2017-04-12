import { EventEmitter } from 'events'
import axios from 'axios'

export default class RoomService extends EventEmitter {
  constructor() {
    super()
  }

  addRoom(timeslots) {
    this.createRoom(room, this.hasBeenAdded.bind(this), this.getThem.bind(this))
  }

  getThem(userid) {
    this.getRooms(userid, this.gotthem.bind(this))
  }

  createRoom(interviewer, roomid, callback) {
    axios.post('/api/Meeting', {
        owner_id: interviewer,
        room_url:,
        time:
    })
    .then(function (response) {
      console.log(response)
      callback()

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getRooms(userid, callback) {
    axios.get('/api/Meeting', {
      params: {
        owner_id: userid
      }
    })
    .then(function (response) {
      response.data.forEach(function(slot) {
        slot.start = new Date(slot.start)
        slot.end = new Date(slot.end)
      })

      callback(response)
      //this.gotthem(reponse).bind(this)
      console.log('got slots', response);
      console.log('got slots', response.data);


    })
    .catch(function (error) {
      console.log(error);
    });
  }
  hasBeenAdded(slots) {
    this.emit('rooms_added', slots)
  }
  gotthem(slots) {
    this.emit('got_rooms', slots)
  }

}

