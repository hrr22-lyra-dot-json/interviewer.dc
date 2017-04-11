import React from 'react'
import AuthService from '../Services/AuthService.js'

export class Login extends React.Component {

  render() {

    console.log('props', this.props);
    const { auth } = this.props.routes[1]

    return (
      <div className="container login">
        <div className="jumbotron">
          <div className="row align-items-center justify-contents-center">
            <div className="col">
              <h1>Interviewer.DC</h1>
            </div>
            <div className="w-100"></div>
            <div className="col">
              <p>Brought to you by Project Washington</p>
            </div>
            <div className="w-100"></div>
            <div className="col">
              <img src="client/assets/capitol-bldg.png" alt="Interviewer.DS Logatron" />
            </div>
            <div className="w-100"></div>
            <div className="col">
              <button className="btn btn-default" onClick={auth.login.bind(this)}>Login</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
