import React from 'react'
import moment from 'moment'
import events from '../events'
import BigCalendar from 'react-big-calendar'
import CalendarService from '../Services/CalendarService.js'
import CalendarAuth from './CalendarAuth.jsx'
import AddAvail from './AddAvailabilityModal.jsx'

import Popup from 'react-popup'


const calServ = new CalendarService()
// a localizer for BigCalendar
BigCalendar.momentLocalizer(moment)

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {events:[], availableSlots:[]};
    this.calService = calServ;
    console.log(calServ);
    this.hello = {start: ''};

    calServ.on('events_loaded', (evv) => {
       this.setState({events: evv})


     })
  }

  handleAuthClicker () {
    this.calService;
  }
  render () {
    return (
      // React Components in JSX look like HTML tags

      <div>
      <CalendarAuth calserv={this.calService}/>


      <BigCalendar
      selectable={true}
        timeslots={8}
        style={{height: '420px'}}
        events={this.state.events}
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date(2015, 3, 12)}
        onSelectEvent={event => alert(event.title)}
        onSelectSlot={(slotInfo) => {console.log('hello')
        alert(
            `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
            `\nend: ${slotInfo.end.toLocaleString()}`
          )
        this.hello = slotInfo;
        return (<AddAvail info={slotInfo} />)

        }}

      />
      <AddAvail info={this.hello} />

      </div>
    )
  }
}

module.exports = Calendar

// Popup.alert(
//             `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
//             `\nend: ${slotInfo.end.toLocaleString()}`
//           )}}