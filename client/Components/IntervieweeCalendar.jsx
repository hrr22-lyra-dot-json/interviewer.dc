import CalView from './CalendarView.jsx'
import React from 'react'
import moment from 'moment'
import events from '../events'
import BigCalendar from 'react-big-calendar'
import CalendarService from '../Services/CalendarService.js'
import CalendarAuth from './CalendarAuth.jsx'
import Modal from 'react-modal';
import Select from 'react-select';
import TimeslotService from '../Services/TimeslotService.js'


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

// const options = [
//   { value: 15, label: '15 minutes' },
//   { value: 20, label: '20 minutes' },
//   { value: 30, label: '30 minutes' },
//   { value: 45, label: '45 minutes' },
//   { value: 60, label: '60 minutes' }
// ];

const calServ = new CalendarService()
var slotServ = new TimeslotService();

// a localizer for BigCalendar
//BigCalendar.momentLocalizer(moment)

class CalendarInterviewee extends React.Component {
  constructor (props) {
    super(props)
    this.state = {events:[], availableSlots:[], modalIsOpen: false, slotInfo:{start:'', end:''}, selectable:false, slotLength: 30, booking:{}};
    this.state.eventsAndSlots = this.state.events.concat(this.state.availableSlots)
    this.calService = calServ;
    console.log(calServ);
    console.log('query', props.location.query);
    this.interviewer = Number(props.location.query.interviewer)
    slotServ.getThem(this.interviewer)
    //this.setState({eventsAndSlots:this.state.events.concat(this.state.availableSlots)})

    calServ.on('events_loaded', (evv) => {
       this.setState({events: evv})
       this.setState({eventsAndSlots: this.state.events.concat(this.state.availableSlots)})
     })
    slotServ.on('got_slots', (slots) => {
      console.log('slots',typeof slots.data[0].start)
      this.setState({availableSlots: slots.data})
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
    this.setState({modalIsOpen: false});
  }
  addAvailability(slotLength, slotInfo) {
    var booking = this.state.booking
    console.log('booking', booking)
    this.setState({modalIsOpen: false});
    //post request to availability slots database
  }

  handleAuthClicker () {
    this.calService;
  }

  eventClick(event) {

    if (event.title === 'Book Interview') {

    this.setState({booking:event})
    this.openModal();
  }

    //alert(event.title)
  }

  render () {
    return (

      <div>
      <div className="jumbotron">
      <h1>Book your interview with ...interviewername</h1>
        <p>Please book a calendar with ... interviewername by clicking on one of the available timeslots. Enter yourpersonal details email to receive the details of the interview ideally gmail. Email input has to be added with ideally validation and name input. eventually we may have a prepopulated name list with people that have been invited to book an interview.</p>
      </div>
      <CalendarAuth calserv={this.calService}/>
      <CalView events={this.state.eventsAndSlots} selectable={this.state.selectable} calService={this.calService} selectSlot={this.addInfo.bind(this)} eventClick={this.eventClick.bind(this)} />
      <div>
        <button onClick={this.openModal}>Open Modal</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Book interview"
        >

          <h2 ref="subtitle">Book interview</h2>
          <p>confirm interview? {this.state.booking.title} to: </p>

          <button className="clbtn" onClick={this.addAvailability}>Confirm</button>

          <button className="clbtn" onClick={this.closeModal}>close</button>
          <div>Good luck!</div>
          <form>
            <input />

          </form>
        </Modal>
      </div>
      </div>

    )
  }
}

module.exports = CalendarInterviewee