import React from 'react'
import RoomService from '../Services/RoomService.js'
import Modal from 'react-modal';
import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'


const customStyles = {
  overlay: {
    zIndex: 10
  },
  content : {
    top                   : '20%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

var roomService = new RoomService()


class RoomList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {rooms:[{position: 'janitor'}], modalIsOpen: false}

    if (localStorage.getItem('googleUser')) {
      roomService.getThem(JSON.parse(localStorage.getItem('googleUser')).user.id)
    }


    roomService.on('got_rooms', (rooms) => {
      console.log('rooms', rooms.data)
      this.setState({rooms: rooms.data})
    })

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addAvailability = this.addAvailability.bind(this)

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
    //create room
    var room = {}
    room.userid = JSON.parse(localStorage.getItem('googleUser')).user.id
    room.position = this.state.position
    roomService.addRoom(room)
    this.setState({modalIsOpen: false});
    Materialize.toast(`Room "${this.state.position}" created!`, 4000)
  }

  handleChange(event) {
    this.setState({position: event.target.value});
  }



  render() {
    return (
      <div>

        <ul className="collection with-header">
          <li className="collection-header"><div><h4>Rooms<button id="add-room-button" onClick={this.openModal} className="btn-floating btn-large waves-effect waves-light blue darken-3 secondary-content"><i className="glyphicons glyphicons-plus"></i></button></h4></div></li>

          {this.state.rooms.map(function(room, key) {
            return (
              <div key={key}>
                <li className="collection-item">
                  <div>{room.job_position}
                    <Link to={{ pathname: '/interviewroom', state: room.job_position + room.owner_id/*, query: {roomname: room.job_position + room.owner_id}*/ }} className="secondary-content">
                      <span className="glyphicons glyphicons-exit rooms-section-icons"></span>
                    </Link>
                    <Link to={{ pathname: '/interviewee', query: {interviewer: room.owner_id, job_position: room.job_position}/*, query: {roomname: room.job_position + room.owner_id}*/ }} className="secondary-content">
                      <span className="glyphicons glyphicons-calendar rooms-section-icons"></span>
                    </Link>
                  </div>
                </li>
              </div>
            )
          })}
        </ul>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Add Availability"
        >

          <div className="container">
            <h2 ref="subtitle">Create room</h2>
            <p>Create new room. a room is typically used for interviews of the same position as the room settings can be set to suit the type of interview. For example you might include code sharing, or you might have a different question list depending on the job you are interviewing for.</p>
            <p>Options regarding the room are still to come</p>
            <p>Job position the room is for?</p>

            <form>
              <div className="row">
                <div className="input-field col s12">
                  <input id="room_name" type="text" className="validate" value={this.state.position} onChange={this.handleChange.bind(this)} />
                  <label for="room_name">Room Name</label>
                </div>
              </div>
              <button type="submit" className="clbtn btn waves-effect waves-light blue darken-3 left" onClick={this.addAvailability}><span className="glyphicons glyphicons-ok"></span></button>
              <button type="button" className="clbtn btn waves-effect waves-light red darken-3 right" onClick={this.closeModal}><span className="glyphicons glyphicons-remove"></span></button>
            </form>
          </div>

        </Modal>

        {/* <ul>
          {this.state.rooms.map(function(room) {
            return <div>
            <li>{room.job_position}</li>
            <Link to={{ pathname: '/interviewroom', query: {roomname: room.job_position + room.owner_id} }} className="btn btn-primary">Go to room</Link>
            </div>
          })}
        </ul> */}

      </div>

      )

  }

}





module.exports = RoomList
