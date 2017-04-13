import React from 'react';
import {Link} from 'react-router';

const Nav = ({name, logout}) => (
  <nav className="splash-nav blue darken-3">
    <div className="nav-wrapper">
      Hello, {name}!
      <a href="/#" className="brand-logo center">Interviewer.DC</a>
      <ul className="right"><li><Link to='/login' onClick={logout} className="right" className="btn waves-effect waves-light indigo darken-4">Sign Out</Link></li></ul>
    </div>
  </nav>
)

module.exports = Nav;
