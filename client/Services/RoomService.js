import { EventEmitter } from 'events'
import axios from 'axios'

export default class RoomService extends EventEmitter {
  constructor() {
    super()
  }

  addRoom(room) {
    this.createRoom(room, this.hasBeenAdded.bind(this), this.getThem.bind(this))
  }

  getThem(userid) {
    this.getRooms(userid, this.gotthem.bind(this))
  }

  createRoom(room, callback, callback2) {
    axios.post('/api/Meeting', {
        owner_id: room.userid,
        job_position: room.position
    })
    .then(function (response) {
      console.log(response)
      callback(response)
      callback2(JSON.parse(localStorage.getItem('dbUser')).id)

    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getRooms(userid, callback) {
    axios.get('/api/Meetings', {
      params: {
        owner_id: userid
      }
    })
    .then(function (response) {
      callback(response)
      //this.gotthem(reponse).bind(this)
      console.log('got rooms', response);
      console.log('got rooms', response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  hasBeenAdded(rooms) {
    this.emit('rooms_added', rooms)
  }
  gotthem(rooms) {
    this.emit('got_rooms', rooms)
  }

}

