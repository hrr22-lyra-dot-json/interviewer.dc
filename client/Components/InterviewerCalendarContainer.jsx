import CalView from './CalendarView.jsx'
import React from 'react'
import moment from 'moment'
import events from '../events'
import BigCalendar from 'react-big-calendar'
import TimeslotService from '../Services/TimeslotService.js'
import RoomService from '../Services/RoomService.js'
import googleCalendar from '../Services/cService.js'
import CalendarAuth from './CalendarAuth.jsx'
import RoomList from './RoomList.jsx'
import Modal from 'react-modal';
import Select from 'react-select';

const customStyles = {
  overlay: {
    zIndex: 10
  },
  content : {
    top                   : '30%',
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

const googleCalendarService = new googleCalendar()
var slotService = new TimeslotService()
var roomServ = new RoomService()

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {events:[], availableSlots:[], modalIsOpen: false, slotInfo:{start:new Date(), end:new Date()}, selectable:true, slotLength: 30};

    this.state.eventsAndSlots = this.state.events.concat(this.state.availableSlots)

    if (localStorage.getItem('googleUser')) {
      slotService.getThem(JSON.parse(localStorage.getItem('googleUser')).user.id)
    }

    slotService.on('got_slots', (slots) => {
      console.log('slots', slots.data)
      this.setState({availableSlots: slots.data})
      this.setState({eventsAndSlots: this.state.events.concat(this.state.availableSlots)})
    })

    googleCalendarService.on('events_loaded', (evv) => {
       this.setState({events: evv})
       this.setState({eventsAndSlots: this.state.events.concat(this.state.availableSlots)})
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
  addAvailability(slotLength, slotInfo) {

    var mainSlot = this.state.slotInfo
    var slotSize = this.state.slotLength
    var slotSizeMs = slotSize * 60 * 1000
    var startTime = mainSlot.start.valueOf()
    var endTime = mainSlot.end.valueOf()
    var newTimeSlots = [];
    var userid = JSON.parse(localStorage.getItem('googleUser')).user.id
    console.log('guserid', userid);

    while(startTime + slotSizeMs < endTime) {
      var newSlot = {}
      newSlot.start = new Date(startTime)
      startTime = startTime + slotSizeMs
      newSlot.end = new Date(startTime)
      newSlot.owner_id = userid
      newSlot.title = 'Book Interview'
      newTimeSlots.push(newSlot)
    }
    slotService.addThem(newTimeSlots)
    //post newtime slots to database with callback GET request to get freshly added timeslots
    //this will go away as we use get request to show available slots
    //this.setState({eventsAndSlots: this.state.events.concat(this.state.availableSlots)})
    console.log('start:', startTime )
    this.setState({modalIsOpen: false, selectable:true});
    //post request to availability slots database
    Materialize.toast(`Availability added!`, 4000)
  }

  handleAuthClicker () {
    googleCalendarService.getItems
    //this.calService;
  }

  eventClick(event) {
    console.log('this is the event', event)
    if (event.title === 'Book Interview') {
      Materialize.toast(`Appointment slot for ${event.title} on ${event.start.toDateString()} at ${event.start.toTimeString()} deleted`, 6000)
      slotService.deleteSlot(event.id, slotService.getThem.bind(slotService))
    }
  }

  render () {
    return (

      <div className="container calendar-section">
      <div>
  {/* <button id="authorize-button" onClick={calserv.handleAuthClick.bind(calserv)}>See Google Calendar events</button>
  <button id="signout-button">Hide other Google calendar events</button> */}

  <button id="authorize-button" className="btn-floating btn-large waves-effect waves-light blue darken-3 view-cal-events-button" onClick={googleCalendarService.getThem.bind(googleCalendarService)}>
    <i className="glyphicons glyphicons-important-day"></i>
  </button>

  <pre id="content"></pre>
</div>
      <CalView events={this.state.eventsAndSlots} selectable={this.state.selectable}  selectSlot={this.addInfo.bind(this)} eventClick={this.eventClick.bind(this)} />
      <div>

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
          <button className="btn btn-default blue darken-3" onClick={this.addAvailability}>Confirm</button>
          <button className="btn btn-default red" onClick={this.closeModal}>close</button>

        </Modal>
      </div>

      <RoomList />


      </div>


    )
  }
}

module.exports = Calendar
