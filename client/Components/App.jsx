import PropTypes from 'prop-types'; //This file holds the router and instantiates the authentication superpack
import React from 'react'
import { hashHistory, Router, Route, Link, Redirect, withRouter} from 'react-router'
import Login from './Login.jsx'
import Home from './Home.jsx'
import CalendarInterviewee from './IntervieweeCalendar.jsx' // this is the page interviewees come too to book availabilities
import AuthService from '../Services/AuthService.js'

const auth = new AuthService('bIi5wFickS2TiO4JVTmyXIsfsLEJAYor', 'sdm.auth0.com')

export default class App extends React.Component {
  constructor(props) {
    super(props);
    auth.on('logged_out', (bye) => {
    })
  }
// validate authentication for private routes
  requireAuth (nextState, replace)  {
    console.log('auth', auth);
      if (!auth.loggedIn()) {
      replace({ pathname: '/login' })
     }
  }
//still working on some of the routes but this works for now
  render() {
    return (
      <Router history={hashHistory}>
        <div>
          <Route path="/"  component={Home} auth={auth} onEnter={this.requireAuth} />
          <Route name='/' path="?access_token=:accesstoken&expires_in=:expiry&id_token=:idtoken&token_type=:tokentype&state=:stater" component={Home} auth={auth} onEnter={this.requireAuth} />
          <Route path='/home' component={Home} auth={auth} onEnter={this.requireAuth} />
          <Route path="/login" component={Login} auth={auth} />
          <Route path="/interviewee" component={CalendarInterviewee} auth={auth} />
        </div>

      </Router>
    )
  }
}
