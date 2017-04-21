import React from 'react'
import moment from 'moment'
//import events from '../events'
import BigCalendar from 'react-big-calendar'
//import CalendarAuth from './CalendarAuth.jsx'
// a localizer for BigCalendar
BigCalendar.momentLocalizer(moment)

var CalView = ({events, selectable, selectSlot, eventClick}) => (

      <div>
      <BigCalendar
      selectable={selectable}
        timeslots={8}
        style={{height: '75vh'}}
        step={15}
        events={events}
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date()}
        onSelectEvent={(event) =>
            {if (event.title === 'Book Interview') {
                mbox.confirm('Are you sure you want to delete this event?', (yes, e = event) => {
                if (yes) eventClick(e);
            })}}}
       onSelectSlot={(slotInfo) => {selectSlot(slotInfo);
    }}

      />
      </div>
    )


module.exports = CalView

