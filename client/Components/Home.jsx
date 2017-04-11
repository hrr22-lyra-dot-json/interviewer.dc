import React from 'react'
import AuthService from '../Services/AuthService.js'
import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'
import Nav from './Nav.jsx'
import Calendar from './InterviewerCalendarContainer.jsx' //InterviewerCalendarContainer
import Timeslots from './Calendar.jsx'
import CalendarAuth from './CalendarAuth.jsx'
import CalendarService from '../Services/CalendarService.js'






export class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {  profile: props.routes[1].auth.getProfile() }

    console.log('query', props.location.query);


    props.routes[1].auth.on('logged_out', (bye) => {
      this.setState({profile: this.props.routes[1].auth.getProfile()})
    })
  }

  logout(){
    this.props.routes[1].auth.logout()
  }

  render() {
    // const { auth } = this.props.routes[1]

    return (
      <div>
      <div className="jumbotron">
          <h1>Welcome to Interviewer Direct Connect! </h1>
          <p>The most advanced interviewing platform in the world brought to you by Project Washington.</p>
          <p >
                <small>Hello {this.state.profile.name}</small>
              </p>

              <Link to='/login' onClick={this.logout.bind(this)} className="rightimg" className="btn btn-primary">Sign Out</Link>
      </div>


      <Calendar />


      </div>
    )
  }
}

export default Home;