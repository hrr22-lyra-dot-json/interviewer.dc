import React from 'react'
import CalendarService from '../Services/CalendarService.js'
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


class CalendarModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {modalIsOpen: props.modalDisplay, slotInfo:props.slotInfo, slotLength: 30, addSlotsFn: props.addSlotFunction};

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.logChange = this.logChange.bind(this)
  }
  // addInfo(slotInfo) {
  //   this.setState({slotInfo:slotInfo, selectable:false})
  //   this.openModal();

  // }
  logChange(val) {
    this.setState({slotLength: val.value})
    console.log("Selected: ", val);
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }
  afterOpenModal() {
    // references are now sync'd and can be accessed. this.refs.subtitle.style.color = '#f00';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
  }

  render () {
    return (

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
          <button className="clbtn" onClick={this.state.addSlotsFn(this.state.slotLength, this.state.slotInfo)}>Confirm</button>

          <button className="clbtn" onClick={this.closeModal}>close</button>
          <div>IThis is dope!</div>
          <form>
            <input />
            <button>Never </button>
            <button>stop</button>
            <button>Catching</button>
            <button>D</button>
          </form>
        </Modal>
      </div>




    )
  }
}

module.exports = CalendarModal