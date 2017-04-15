import axios from 'axios';
import { EventEmitter } from 'events'

export default class newAuth extends EventEmitter {
  constructor() {
    super()
    //this.user = localStorage.getItem('dbUser');

  }

  loginner() {
    return axios.get('/auth/google')
    .then(function (response) {
      console.log('res',reponse);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  isIn() {
    this.isLoggedIn(this.logmit.bind(this))
  }

  isLoggedIn(callback) {
     axios.get('/logged-in')
    .then(function(response) {
      console.log('g usertown', response.data)
      if (response.data.user) {
        localStorage.setItem('googleUser', JSON.stringify(response.data.user))
        console.log('g usertown', response.data.user)
        callback(true)
        return true
      }
      console.log('notlodgedin')
      callback(false)
      return false
    })
  }
  logmit(islogged) {
    this.emit('log_result', islogged)
  }
}

