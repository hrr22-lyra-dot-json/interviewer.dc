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



  const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};



const calServ = new CalendarService()
// a localizer for BigCalendar
BigCalendar.momentLocalizer(moment)

class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {events:[], availableSlots:[], modalIsOpen: false, slotInfo:{start:''}};
    this.calService = calServ;
    console.log(calServ);
    this.hello = {start: ''};

    calServ.on('events_loaded', (evv) => {
       this.setState({events: evv})


     })
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(slotInfo) {
    this.setState({slotInfo:slotInfo});
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.refs.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }



  handleAuthClicker () {
    this.calService;
  }

  handleAddAvailability (slotInformation) {
    //console.log(slotInformation.start.toLocaleString())
    // return Popup.alert('I am alert, nice to meet you');
    return (<Popout title='Window title' >

      </Popout>)


    // Popup.prompt('Type your name below', 'What\'s your name?', {
    //     placeholder: 'Placeholder yo',
    //     type: 'text'
    //   }, {
    //     text: 'Save',
    //     className: 'success',
    //     action: function (Box) {
    //       Popup.alert('Your name is: ' + Box.value);
    //       Box.close();
    //     }
    // })
    // return (<p>{slotInformation.start.toLocaleString()}</p>)
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
       onSelectSlot={(slotInfo) => {this.openModal(slotInfo);
      //    this.openModal(slotInfo); //this.openModal(slotInfo)  //
      // //}
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
          <p>Add availability slot for interviews from {typeof this.state.slotInfo.start}</p>

          <button onClick={this.closeModal}>close</button>
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