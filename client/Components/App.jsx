import React, { PropTypes } from 'react'

import { BrowserRouter as Router, Route, Link, Redirect, withRouter} from 'react-router'
import Login from './Login.jsx'
import Home from './Home.jsx'
import AuthService from '../Services/AuthService.js'


const auth = new AuthService('bIi5wFickS2TiO4JVTmyXIsfsLEJAYor', 'sdm.auth0.com')
var peth = '/home';
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}
const routes = ( <div>
        <Route path="/" component={Home} auth={auth} onEnter={requireAuth} />
          <Route path={peth} component={Home} auth={auth} onEnter={requireAuth} />
          <Route path="/login" component={Login} auth={auth} />
        </div>)


export default class App extends React.Component {

  constructor(props) {
    super(props);
    // this.state = {}
    this.state = {name: 'Simon'}
    auth.on('logged_out', (bye) => {
      peth = "/login";
            this.setState({name: 'John'})

      console.log('hwhy2fromapp')

      // this.requireAuth;

      //this.render();
    })
  }




// validate authentication for private routes
  requireAuth (nextState, replace)  {
    console.log('auth', auth);
      if (!auth.loggedIn()) {
      replace({ pathname: '/login' })
     }
    this.state = {}
  }


// validate authentication for private routes
  // const requireAuth = (nextState, replace) => {
  //   if (!auth.loggedIn()) {
  //     replace({ pathname: '/login' })
  //   }
  // }

  render() {
    return (
      <Router history={hashHistory}>
      {routes}
      </Router>
    )
  }
}


