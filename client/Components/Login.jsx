import React from 'react'
//import AuthService from '../Services/AuthService.js'
import newAuth from '../Services/newAuthenticationService.js'


const hell = new newAuth()


export class Login extends React.Component {

  render() {

    console.log('props', this.props);

    return (
      <div className="splash">

        <nav className="splash-nav blue darken-3">
          <div className="nav-wrapper">
            <a href="#" className="brand-logo center">Interviewer Direct Connection</a>
            {/* <a href="/auth/google">Login with Google</a>

            <ul className="right"><li><button onClick={hell.isIn.bind(hell)} className="right" className="btn waves-effect waves-light indigo darken-4">Sign In</button></li></ul> */}
            <ul className="right"><li><a href="/auth/google" className="right" className="btn waves-effect waves-light indigo darken-4">Sign In</a></li></ul>


          </div>
        </nav>

        <div className="row splash-header-row center-align grey lighten-2">
          <img src="client/assets/splash-header.jpg" className="responsive-img splash-header" alt="Interviewer.DS Logatron" />
        </div>

        <div className="container login center-align">
          <div className="row">
            <h4 className="header">The Next Interviewing Platform Has Arrived</h4>
            <div className="col s12 m4">
              <span className="glyphicons glyphicons-facetime-video x4 splash-icons"></span>
              <h5>Streamlined Video Interface</h5>
              <p>Conduct interviews in a carefully-designed web platform, with features such as recording, white boarding, and code sharing. Early arrivals will remain in the room lobby until the interviewer begins the meeting.</p>
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
          <div className="row center-align splash-try-button">
            <a href="/auth/google" className="right" className="btn waves-effect waves-light indigo darken-4">Try It Out!</a>
          </div>
        </div>


        <footer className="page-footer blue darken-3">
          <div className="footer-copyright indigo darken-4 valign-wrapper">
            <div className="container">
            &copy; 2017 Interviewer DC, All rights reserved.
            <a className="grey-text text-lighten-4 right" href="https://github.com/hrr22-lyra-dot-json/interviewer.dc/blob/master/LICENSE">MIT License</a>
            </div>
          </div>
        </footer>

      </div>
    )
  }
}

export default Login;
