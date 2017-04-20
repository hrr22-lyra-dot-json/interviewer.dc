import React from 'react';
import {Link} from 'react-router';



const Nav = ({name}) => (
  <nav className="splash-nav blue darken-3">
    <div className="nav-wrapper">

      <a href="/#">Hello, {name}!</a>
      {/* <a href="/#" className="brand-logo center">Interviewer.DC</a> */}

      <ul className="right">
        <li>
          <a href="/logout" className="btn waves-effect waves-light indigo darken-4">Sign Out</a>
        </li>
      </ul>

    </div>
  </nav>
)

module.exports = Nav;
