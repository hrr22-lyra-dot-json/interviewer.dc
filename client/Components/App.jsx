import React from 'react'
import { browserHistory, hashHistory, Router, Route, Link, Redirect, withRouter} from 'react-router'

import Login from './Login.jsx'
import Home from './Home.jsx'
import CalendarInterviewee from './IntervieweeCalendar.jsx' // this is the page interviewees come too to book availabilities
import InterviewRoom from './InterviewRoom.jsx'
import newAuth from '../Services/newAuthenticationService.js'

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  requireAuth(nextState, replace)  {
    if (!localStorage.getItem('googleUser')) {
      replace({ pathname: '/login' })
    }
  }

  render() {
    return (
      <Router history={hashHistory}>
        <div>
          <Route path="/"  component={Home}  />
          <Route path='/home' component={Home}  />
          <Route path="/interviewee" component={CalendarInterviewee}  />
          <Route path="/interviewroom" component={InterviewRoom}  />
        </div>
      </Router>
    )
  }
}