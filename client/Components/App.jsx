import React, { PropTypes } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter} from 'react-router'
import Login from './Login.jsx'
import Home from './Home.jsx'
import AuthService from '../Services/AuthService.js'



export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

  const auth = new AuthService('bIi5wFickS2TiO4JVTmyXIsfsLEJAYor', 'sdm.auth0.com')

// validate authentication for private routes
  const requireAuth = (nextState, replace) => {
    if (!auth.loggedIn()) {
      replace({ pathname: '/login' })
    }
  }

  render() {
    return (
      <Router>
        <div>
          <Route path="home" component={Home} auth={auth} onEnter={requireAuth} />
          <Route path="login" component={Login} auth={auth} />
        </div>
      </Router>
    )
  }
}


