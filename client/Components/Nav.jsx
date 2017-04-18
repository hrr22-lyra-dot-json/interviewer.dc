import React from 'react';
import {Link} from 'react-router';



const Nav = ({name}) => (
  <nav className="splash-nav blue darken-3">
    <div className="nav-wrapper">
      Hello, {name}!
      <a href="/#" className="brand-logo center">Interviewer.DC</a>

    </div>
  </nav>
)

module.exports = Nav;
