import React from 'react'
import AuthService from '../Services/AuthService.js'

export class Login extends React.Component {

  render() {

    console.log('props', this.props);
    const { auth } = this.props.routes[1]

    return (
      <div className="container login">
        <div className="row align-items-center justify-contents-center">
          <div className="col s12">
            <img src="client/assets/capitol-bldg.png" alt="Interviewer.DS Logatron" />
          </div>
          <div className="col s12">
            <button className="btn btn-default" onClick={auth.login.bind(this)}>Login</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
