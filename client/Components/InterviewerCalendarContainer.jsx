import CalView from './CalendarView.jsx'
import React from 'react'
import moment from 'moment'
import events from '../events'
import BigCalendar from 'react-big-calendar'
import CalendarService from '../Services/CalendarService.js'
import TimeslotService from '../Services/TimeslotService.js'

import CalendarAuth from './CalendarAuth.jsx'
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
//BigCalendar.momentLocalizer(moment)
var slotServ = new TimeslotService();

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {events:[], availableSlots:[], modalIsOpen: false, slotInfo:{start:new Date(), end:new Date()}, selectable:true, slotLength: 30};
    this.state.eventsAndSlots = this.state.events.concat(this.state.availableSlots)
    //var slotServ = new TimeslotService();
   // slotServ.getSlots(localStorage.getItem('dbUser').id).bind(slotServ)
   slotServ.getThem(JSON.parse(localStorage.getItem('dbUser')).id)
    slotServ.on('got_slots', (slots) => {
      console.log('slots',typeof slots.data[0].start)
      this.setState({availableSlots: slots.data})
      this.setState({eventsAndSlots: this.state.events.concat(this.state.availableSlots)})
    })

    this.calService = calServ;
    console.log(calServ);
    //this.setState({eventsAndSlots:this.state.events.concat(this.state.availableSlots)})

    calServ.on('events_loaded', (evv) => {
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
    var userid = JSON.parse(localStorage.getItem('dbUser')).id

    while(startTime + slotSizeMs < endTime) {
      var newSlot = {}
      newSlot.start = new Date(startTime)
      startTime = startTime + slotSizeMs
      newSlot.end = new Date(startTime)
      newSlot.owner_id = userid
      newSlot.name = 'Book Interview'
      newTimeSlots.push(newSlot)
    }
    slotServ.addThem(newTimeSlots)
    //post newtime slots to database with callback GET request to get freshly added timeslots
    //this will go away as we use get request to show available slots
    //this.setState({eventsAndSlots: this.state.events.concat(this.state.availableSlots)})
    console.log('start:', startTime )
    this.setState({modalIsOpen: false, selectable:true});
    //post request to availability slots database
  }

  handleAuthClicker () {
    this.calService;
  }

  eventClick(event) {
    alert(event.title)
  }

  render () {
    return (

      <div>
      <CalendarAuth calserv={this.calService}/>
      <CalView events={this.state.eventsAndSlots} selectable={this.state.selectable} calService={this.calService} selectSlot={this.addInfo.bind(this)} eventClick={this.eventClick.bind(this)} />
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