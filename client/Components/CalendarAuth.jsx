import React from 'react'
import CalendarService from '../Services/CalendarService.js'


var CalendarAuth = ({calserv}) => (


<div>
  <button id="authorize-button" onClick={calserv.handleAuthClick.bind(this)}>Authorize</button>
    <button id="signout-button">Sign Out</button>

    <pre id="content"></pre>
</div>
)

module.exports = CalendarAuth;
