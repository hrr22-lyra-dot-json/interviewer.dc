import React from 'react' //This page is the homepage of the portal, equivalent to app.jsx in our previous apps. App.jsx now holds the router
import AuthService from '../Services/AuthService.js'
import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'
import Calendar from './InterviewerCalendarContainer.jsx' //InterviewerCalendarContainer
import CalendarAuth from './CalendarAuth.jsx'
import CalendarService from '../Services/CalendarService.js'
import Nav from './Nav.jsx'

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  profile: {name: 'not yet loaded'} }

    console.log('query', props.location.query);//this allows you to access any queries in the url get request

    props.routes[1].auth.on('profile_updated', (profile) => {
      this.setState({profile: this.props.routes[1].auth.getProfile()})
    })
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
        <Nav name={this.state.profile.name} logout={this.logout.bind(this)} />

        <Calendar />
      </div>
    )
  }
}

export default Home;
