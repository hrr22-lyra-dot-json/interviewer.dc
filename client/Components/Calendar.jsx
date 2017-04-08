import React from 'react'
import moment from 'moment'
import events from '../events';


import BigCalendar from 'react-big-calendar'
// a localizer for BigCalendar
BigCalendar.momentLocalizer(moment)

// this weird syntax is just a shorthand way of specifying loaders
//require('style!css!react-big-calendar/lib/css/react-big-calendar.css')

class Calendar extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    return (
      // React Components in JSX look like HTML tags
      <BigCalendar
      selectable={true}
        timeslots={8}
        style={{height: '420px'}}
        events={events}
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date(2015, 3, 12)}
        onSelectEvent={event => alert(event.title)}
        onSelectSlot={console.log('hey!')}

        onSelectSlot={(slotInfo) => {console.log('hello')
          alert(
            `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
            `\nend: ${slotInfo.end.toLocaleString()}`
          )}}
      />
    )
  }
}

module.exports = Calendar