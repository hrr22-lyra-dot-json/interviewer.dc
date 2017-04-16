import axios from 'axios';
import { EventEmitter } from 'events'

export default class newAuth extends EventEmitter {
  constructor() {
    super()
    //this.user = localStorage.getItem('dbUser');

  }



  loginner() {
    //axios('/auth/google').then(console.log)
    axios({
      method: 'get',
      url: '/auth/google',
      headers: {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'}
    })
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

  logout() {
    axios.get('/logout')
    .then(function(response) {
      localStorage.removeItem('googleUser');
        // localStorage.removeItem('profile');
        // localStorage.removeItem('dbUser');
    })
    .catch(function (error) {
      console.log(error);
    });
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
      //localStorage.setItem('googleUser', JSON.stringify(response.data.user))
      console.log('notlodgedin')
      callback(false)
      return false
    })
  }
  logmit(islogged) {
    this.emit('log_result', islogged)
  }
}

