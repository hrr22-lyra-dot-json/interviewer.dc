import React from 'react' //This page is the homepage of the portal, equivalent to app.jsx in our previous apps. App.jsx now holds the router
import AuthService from '../Services/AuthService.js'
import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'
import Calendar from './InterviewerCalendarContainer.jsx' //InterviewerCalendarContainer
import CalendarAuth from './CalendarAuth.jsx'
import Nav from './Nav.jsx'
import newAuth from '../Services/newAuthenticationService.js'
import Login from './Login.jsx'


const googleLoginService = new newAuth()


document.title = `Dashboard | Interviewer Direct Connection`;

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isIn: false, profile: {username: 'loading...'} }
    googleLoginService.isIn()
    googleLoginService.on('log_result', (result) => {
      if (result) {
      this.setState({isIn: result, profile: JSON.parse(localStorage.getItem('googleUser')).user})
    }
    }
    )


    //this.state = {  profile: this.props.routes[1].auth.getProfile() }

    console.log('query', props.location.query);//this allows you to access any queries in the url get request

    // props.routes[1].auth.on('profile_updated', (profile) => {
    //   this.setState({profile: this.props.routes[1].auth.getProfile()})
    // })
    // props.routes[1].auth.on('logged_out', (bye) => {
    //   this.setState({profile: this.props.routes[1].auth.getProfile()})
    // })
  }



  render() {
    if (!this.state.isIn) {
      return (
        <Login />
        )
    } else {


    return (
      <div>
        <Nav name={this.state.profile.username}  />

        <Calendar />
      </div>
    )
  }
}
}

export default Home;
