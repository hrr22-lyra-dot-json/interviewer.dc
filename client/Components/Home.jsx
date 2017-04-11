import React from 'react' //This page is the homepage of the portal, equivalent to app.jsx in our previous apps. App.jsx now holds the router
import AuthService from '../Services/AuthService.js'
import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'
import Calendar from './InterviewerCalendarContainer.jsx' //InterviewerCalendarContainer
import CalendarAuth from './CalendarAuth.jsx'
import CalendarService from '../Services/CalendarService.js'

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  profile: props.routes[1].auth.getProfile() }

    console.log('query', props.location.query);//this allows you to access any queries in the url get request

    props.routes[1].auth.on('logged_out', (bye) => {
      this.setState({profile: this.props.routes[1].auth.getProfile()})
    })
  }

  logout(){
    this.props.routes[1].auth.logout()//for some reason we have to access 'auth' which is passed in from app.jsx via props.routes
  }

  render() {

    return (
      <div>
        <div className="jumbotron">
            <h1>Welcome to Interviewer Direct Connect! </h1>
            <p>The most advanced interviewing platform in the world brought to you by Project Washington.</p>
            <p>
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