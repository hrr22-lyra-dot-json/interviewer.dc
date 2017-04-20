import React from 'react'
import CalendarService from '../Services/CalendarService.js'



var CalendarAuth = ({getGoogleEvents}) => (


<div>
  <button id="authorize-button" className="btn waves-effect waves-light blue darken-3 view-cal-events-button" onClick={getGoogleEvents}>
    Toggle GCal
  </button>

  <pre id="content"></pre>
</div>
)

module.exports = CalendarAuth;
