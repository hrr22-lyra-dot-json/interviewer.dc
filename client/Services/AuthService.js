import { EventEmitter } from 'events'
import Auth0Lock from 'auth0-lock'
import axios from 'axios';


//import { browserHistory } from 'react-router' //    "react-router": "^2.8.0"

//addUserto db service
var addUser = function(user) {
  console.log('sending user', user)
  axios.post('/api/User', {
    username: user.name,
    email: user.email
  })
  .then(function (response) {
    console.log('added user', response);
    //localStorage.setItem('profile', JSON.stringify(profile))
    localStorage.setItem('dbUser', JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
}


export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
        super()

    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        redirectUrl: window.location.origin + '/',
        responseType: 'token'
      }
    })
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
  }

  _doAuthentication(authResult) {
    // Saves the user token
    this.setToken(authResult.idToken)
    // navigate to the home route
   // browserHistory.replace('/home')

   this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error)
      } else {
        this.setProfile(profile)
      }
    })
  }
  _authorizationError(error){
    // Unexpected authentication error
    console.log('Authentication Error', error)
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show()
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    return !!this.getToken()
  }

  setProfile(profile){
    // Saves profile data to localStorage
    console.log('profile', profile)
    addUser(profile);


    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile)
  }

  getProfile(){
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  setToken(idToken) {
    // Saves user token to local storage
    localStorage.setItem('id_token', idToken)
  }

  getToken() {
    // Retrieves the user token from local storage
    return localStorage.getItem('id_token')
  }

  logout() {
    // Clear user token and profile data from local storage
    localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
            //localStorage.removeItem('projects');
            console.log('loggedout')

            this.emit('logged_out', 'bye');



  }
}