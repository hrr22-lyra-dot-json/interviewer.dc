import React from 'react' //This page is the homepage of the portal, equivalent to app.jsx in our previous apps. App.jsx now holds the router
//import AuthService from '../Services/AuthService.js'
import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'
import Calendar from './InterviewerCalendarContainer.jsx' //InterviewerCalendarContainer
import Nav from './Nav.jsx'
import Login from './Login.jsx'
import RoomView from './RoomView.jsx'
import newAuth from '../Services/newAuthenticationService.js'



const googleLoginService = new newAuth()

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isIn: false, profile: {username: 'loading...'}, activeRoom: null }
    googleLoginService.isIn()
    googleLoginService.on('log_result', (result) => {
      if (result) {
      this.setState({isIn: result, profile: JSON.parse(localStorage.getItem('googleUser')).user})
      }
    })

    //this.state = {  profile: this.props.routes[1].auth.getProfile() }

    console.log('query', props.location.query);//this allows you to access any queries in the url get request

    // props.routes[1].auth.on('profile_updated', (profile) => {
    //   this.setState({profile: this.props.routes[1].auth.getProfile()})
    // })
    // props.routes[1].auth.on('logged_out', (bye) => {
    //   this.setState({profile: this.props.routes[1].auth.getProfile()})
    // })
  }
  roomSelect(room) {
    $('.button-collapse').sideNav('hide');
    this.setState({activeRoom:room})
  }


  render() {
    if (!this.state.isIn) {
      document.title = `Login | Interviewer Direct Connection`;
      return (
        <Login />
      )
    } else {
      document.title = `Dashboard | Interviewer Direct Connection`;
      if (!this.state.activeRoom) {
        return (
          <div>
            <Nav name={this.state.profile.username} roomSelect={this.roomSelect.bind(this)} />

            <Calendar name={this.state.profile.username} />

          </div>
        )

      } else {
        document.title = `${this.state.activeRoom.job_position} | Interviewer Direct Connection`;
        return (
          <div>
            <Nav name={this.state.profile.username} room={this.state.activeRoom.job_position} />

            <RoomView info={this.state.activeRoom} />
          </div>
        )
      }
    }
  }
}

export default Home;
