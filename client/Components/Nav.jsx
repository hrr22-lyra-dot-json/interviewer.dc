import React from 'react';
import {Link} from 'react-router';



const Nav = ({name}) => (
  <nav className="splash-nav blue darken-3">
    <div className="nav-wrapper">

      <ul className="right">
        <li>
          <a className='dropdown-button' href='/#' data-activates='sign-out-dropdown' data-hover='true' data-belowOrigin='true'>Hello, {name}!</a>

          <ul id='sign-out-dropdown' className='dropdown-content'>
            <li><a href="/logout"><span className="glyphicons glyphicons-log-out"></span>Sign Out</a></li>
          </ul>
        </li>
      </ul>

    </div>
  </nav>
)

module.exports = Nav;
