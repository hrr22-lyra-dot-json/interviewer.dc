import React from 'react'
import AuthService from '../Services/AuthService.js'
import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'


//import styles from './styles.module.css'

export class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {  profile: props.routes[1].auth.getProfile() }

    props.routes[1].auth.on('logged_out', (bye) => {
      console.log('hwhy')
      this.setState({profile: this.props.routes[1].auth.getProfile()})


      //this.render();
    })
  }

  logout(){
    this.props.routes[1].auth.logout()
    console.log('ello')
    // return (
    //   <Redirect pushg/>
    //   )


     // return (<Redirect to='/login'/>)
  }



  render() {
    // const { auth } = this.props.routes[1]

    return (
      <div>
        <p>Welcome to Interviewer Direct Connect! </p>
        <p>The most advanced interviewing platform in the world.</p>
        <p >
              <small>Hello {this.state.profile.name}</small>
            </p>

            <button onClick={this.logout.bind(this)} className="btn btn-primary">Sign Out</button>


      </div>
    )
  }
}

export default Home;