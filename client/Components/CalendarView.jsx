import React from 'react'
import moment from 'moment'
//import events from '../events'
import BigCalendar from 'react-big-calendar'
import CalendarService from '../Services/CalendarService.js'
//import CalendarAuth from './CalendarAuth.jsx'
// a localizer for BigCalendar
BigCalendar.momentLocalizer(moment)

var CalView = ({events, selectable, calService, selectSlot, eventClick}) => (

      <div>
      <BigCalendar
      selectable={selectable}
        timeslots={8}
        style={{height: '420px'}}
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

// alert(
//             `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
//             `\nend: ${slotInfo.end.toLocaleString()}`
//           )
//      <AddAvail info={this.hello} />


// Popup.alert(
//             `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
//             `\nend: ${slotInfo.end.toLocaleString()}`
//           )}}



///////////////////////
// <div>
//         <button onClick={this.openModal}>Open Modal</button>
//         <Modal
//           isOpen={this.state.modalIsOpen}
//           onAfterOpen={this.afterOpenModal}
//           onRequestClose={this.closeModal}
//           style={customStyles}
//           contentLabel="Example Modal"
//         >

//           <h2 ref="subtitle">Hello</h2>
//           <button onClick={this.closeModal}>close</button>
//           <div>I am a modal</div>
//           <form>
//             <input />
//             <button>tab navigation</button>
//             <button>stays</button>
//             <button>inside</button>
//             <button>the modal</button>
//           </form>
//         </Modal>
     // </div>
