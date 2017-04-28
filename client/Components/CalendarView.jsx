import React from 'react'
import moment from 'moment'
import BigCalendar from 'react-big-calendar'

// a localizer for BigCalendar
BigCalendar.momentLocalizer(moment);

function Event({ event }) {
  if(event.description === 'Interview') {
    return (
      <span style={{ color: 'magenta'}}>
        <strong>{event.title}</strong>
        { event.desc && (':  ' + event.desc)}
      </span>
  )} else {
    return (
      <span style={{ color: 'blue'}}>
        <strong>{event.title}</strong>
        { event.desc && (':  ' + event.desc)}
      </span>
    )
  }
}

var eventStyleGetter = function(event, start, end, isSelected) {
    // console.log(event);
    var backgroundColor = '#' + event.hexColor;
    if(event.description === 'Interview') {
      backgroundColor = 'orange'
    }
    if(event.description === 'dbInterview') {
      backgroundColor = 'red'
    }
    if(event.description === 'timeSlot') {
      backgroundColor = 'green'
    }

    var style = {
        backgroundColor: backgroundColor,
        opacity: 0.8,
        color: 'black',
        border: '0px',
        transition: 'transform 0.5s ease'
    };
    return {
        style: style
    };
}

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
          })
        }}
      }
      onSelectSlot={(slotInfo) => {
        selectSlot(slotInfo);
      }}
      defaultView='week'
      eventPropGetter={(eventStyleGetter)}
    />
  </div>
)

module.exports = CalView;