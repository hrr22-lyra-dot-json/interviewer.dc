import React from 'react'
import AuthService from '../Services/AuthService.js'
import newAuth from '../Services/newAuthenticationService.js'

export class Login extends React.Component {

  render() {

    console.log('props', this.props);
    document.title = `Login | Interviewer Direct Connection`;


    return (
      <div className="splash">
        <nav className="splash-nav blue darken-3">
          <div className="nav-wrapper">
            <a href="#" className="brand-logo center">Interviewer Direct Connection</a>
            <a href="/auth/google">Login with Google</a>
            <ul className="right"><li><button onClick={newAuth.loginner} className="right" className="btn waves-effect waves-light indigo darken-4">Sign In</button></li></ul>
          </div>
        </nav>

        <div className="parallax-container">
          <div className="parallax"><img src="client/assets/man-writing.jpg" id="splash-img-top" alt="Interviewer.DS Logatron" /></div>
        </div>

        <div className="section white login center-align">
          <div className="row container">
            <h3 className="header">The Next Interviewing Platform Has Arrived</h3>
            <div className="col s12 m4">
              <span className="glyphicons glyphicons-facetime-video x4 splash-icons"></span>
              <h5>Streamlined Video Interface</h5>
              <p>Conduct interviews in a carefully-designed web platform full of features such as recording, white boarding, and code sharing. Early arrivals will also be greeted by a waiting page in the room lobby until the interviewer begins the meeting.</p>
            </div>
            <div className="col s6 m4">
              <span className="glyphicons glyphicons-calendar x4 splash-icons"></span>
              <h5>Google Calendar Integration</h5>
              <p>Now integrated with Google Calendar for easy scheduling and sharing. Bypass a proprietary event management system calendar and use Google Calendar for easy scheuling, sharing, and and updating.</p>
            </div>
            <div className="col s6 m4">
              <span className="glyphicons glyphicons-envelope x4 splash-icons"></span>
              <h5>Email Notification System</h5>
              <p>Send email notifications when meetings are created, updated, or deleted. Email integration allows for complete oversight of meetings for both the interviewer and the interviewee, reducing no-shows and miscommunication.</p>
            </div>

          </div>
        </div>
        <div className="parallax-container">
          <div className="parallax"><img src="client/assets/laptop-and-notepad.jpg" id="splash-img-bottom" alt="Laptop and notepad on desk" /></div>
        </div>
      </div>
    )
  }
}

export default Login;

$(document).ready(function(){
  $('.parallax').parallax();
});
