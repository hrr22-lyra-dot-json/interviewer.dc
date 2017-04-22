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
    this.state = {rooms:[{position: 'janitor'}] }
    this.roomSelect = props.roomSelect

    if (localStorage.getItem('googleUser')) {
      roomService.getThem(JSON.parse(localStorage.getItem('googleUser')).user.id)
    }


    roomService.on('got_rooms', (rooms) => {
      console.log('rooms', rooms.data)
      this.setState({rooms: rooms.data})
    })

    this.addAvailability = this.addAvailability.bind(this)

  }

  addAvailability(slotLength, slotInfo) {
    //create room
    var room = {}
    room.userid = JSON.parse(localStorage.getItem('googleUser')).user.id
    room.position = this.state.position
    roomService.addRoom(room)
    Materialize.toast(`Room "${this.state.position}" created!`, 4000)
  }

  handleChange(event) {
    this.setState({position: event});
  }

  mboxPrompt(event) {
    let callHandleChange = this.handleChange.bind(this);
    let callAddAvailability = this.addAvailability.bind(this);
    mbox.prompt('Enter room name', function(job) {
      if (job) {
        callHandleChange(job);
        callAddAvailability();
      }
    })
  }

  render() {
    var roomSelect = this.roomSelect.bind(this);
    return (
      <div className="room-list">

        <ul className="collection with-header">
          <li className="collection-header"><div><h4>Rooms<button id="add-room-button" onClick={ this.mboxPrompt.bind(this) } className="btn-floating btn-large waves-effect waves-light blue darken-3 secondary-content"><i className="glyphicons glyphicons-plus"></i></button></h4></div></li>


          {this.state.rooms.map(function(room, key) {
            return (
              <div key={key}>
                <li className="collection-item">
                  <div>{room.job_position}

                    <div className="secondary-content" onClick={() => roomSelect(room)}>
                    <span className="glyphicons glyphicons-exit rooms-section-icons"></span></div>
                    <Link to={{ pathname: '/interviewee', query: {interviewer: room.owner_id, job_position: room.job_position, roomDbId:room.id} }} className="secondary-content">
                      <span className="glyphicons glyphicons-calendar rooms-section-icons"></span>
                    </Link>
                  </div>
                </li>
              </div>
            )
          })}
        </ul>

      </div>
    )
  }

}

module.exports = RoomList
