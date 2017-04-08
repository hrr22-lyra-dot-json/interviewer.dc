import React from 'react'
import AuthService from '../Services/AuthService.js'
<<<<<<< HEAD

=======
//import styles from './styles.module.css'
>>>>>>> cf6e7a0f22cfb4c3ffdeed941454a74f996d682a

export class Login extends React.Component {


  render() {
<<<<<<< HEAD
    console.log('props', this.props.routes[1].auth);
    const { auth } = this.props.routes[1]
=======
    const { auth } = this.props
>>>>>>> cf6e7a0f22cfb4c3ffdeed941454a74f996d682a

    return (
      <div className="container login">
        <div className="jumbotron">
          <div className="row align-items-center justify-contents-center">
            <div className="col">
<<<<<<< HEAD
              <h1>Interviewer.DS</h1>
            </div>
            <div className="w-100"></div>
            <div className="col">
            <h1>Project Washington</h1>
              <img src="client/assets/36665960-Capitol-building-temple-icon-logo-vector-design-Stock-Vector-capitol-capital.jpg" alt="Interviewer.DS Logatron" className="loginimg" />
=======
              <h1>Git It Together</h1>
            </div>
            <div className="w-100"></div>
            <div className="col">
              <img src="client/assets/unicorn-head-silhouette.png" alt="Git It Together logo" />
>>>>>>> cf6e7a0f22cfb4c3ffdeed941454a74f996d682a
            </div>
            <div className="w-100"></div>
            <div className="col">
              <button className="btn btn-primary" onClick={auth.login.bind(this)}>Login</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;