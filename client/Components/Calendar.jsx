import React from 'react'
import moment from 'moment'
import events from '../events'
import BigCalendar from 'react-big-calendar'
import CalendarService from '../Services/CalendarService.js'
import CalendarAuth from './CalendarAuth.jsx'
import AvailModal from './AddAvailabilityModal.jsx'
import Popup from 'react-popup'
import Popout from 'react-popout'
import Modal from 'react-modal';
import Select from 'react-select';




  const customStyles = {
  content : {
    top                   : '20%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const options = [
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' }
];





const calServ = new CalendarService()
// a localizer for BigCalendar
BigCalendar.momentLocalizer(moment)

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {events:[], availableSlots:[], modalIsOpen: false, slotInfo:{start:'', end:''}, selectable:true, slotLength: 30};
    this.calService = calServ;
    console.log(calServ);
    this.hello = {start: ''};

    calServ.on('events_loaded', (evv) => {
       this.setState({events: evv})


     })
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addInfo = this.addInfo.bind(this)
    this.addAvailability = this.addAvailability.bind(this)
    this.logChange = this.logChange.bind(this)
  }

  addInfo(slotInfo) {
    this.setState({slotInfo:slotInfo, selectable:false})
    this.openModal();

  }
  logChange(val) {
    this.setState({slotLength: val.value})
    console.log("Selected: ", val);

  }

  openModal() {
    this.setState({modalIsOpen: true});
    //this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.refs.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false, selectable:true});
  }
  addAvailability() {

    var mainSlot = this.state.slotInfo
    var slotSize = this.state.slotLength
    var slotSizeMs = slotSize * 60 * 1000
    var startTime = mainSlot.start.valueOf()
    var endTime = mainSlot.end.valueOf()
    var newTimeSlots = [];

    while(startTime + slotSizeMs < endTime) {
      var newSlot = {}
      newSlot.start = new Date(startTime)
      startTime = startTime + slotSizeMs
      newSlot.end = new Date(startTime)
      newSlot.user = 'simon'
      newSlot.title = 'Book Interview'
      newTimeSlots.push(newSlot)
    }
    var prevents = this.state.events.concat(newTimeSlots)



    console.log('start:', startTime )



    this.setState({events: prevents, modalIsOpen: false, selectable:true});
    //post request to availability slots database

  }



  handleAuthClicker () {
    this.calService;
  }




  render () {
    return (

      <div>
      <CalendarAuth calserv={this.calService}/>

      <BigCalendar
      selectable={this.state.selectable}
        timeslots={8}
        style={{height: '420px'}}
        step={15}
        events={this.state.events}
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date()}
        onSelectEvent={event => alert(event.title)}
       onSelectSlot={(slotInfo) => {this.addInfo(slotInfo);
    }}

      />
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Add Availability"
        >

          <h2 ref="subtitle">Add Availability</h2>
          <p>Add availability slot for interviews from {this.state.slotInfo.start.toString()} \nto: {this.state.slotInfo.end.toString()}</p>
          <p>Select the length of each interview timeslot. (This will allow interviewees to make bookings of desired length)</p>
          <Select
            name="form-field-name"
            value={this.state.slotLength}
            options={options}
            onChange={this.logChange}
            searchable={false}
            clearable={false}
          />
          <button className="clbtn" onClick={this.addAvailability}>Confirm</button>

          <button className="clbtn" onClick={this.closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
      </div>




      </div>
    )
  }
}

module.exports = Calendar

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