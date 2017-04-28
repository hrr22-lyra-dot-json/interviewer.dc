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
        style={{height: '65vh'}}
        step={15}
        events={events}
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date()}
        onSelectEvent={(event) =>
           { eventClick(event);
            }}
       onSelectSlot={(slotInfo) => {selectSlot(slotInfo);
    }}

      />
      </div>
    )


module.exports = CalView