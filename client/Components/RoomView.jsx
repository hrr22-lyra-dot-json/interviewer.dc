import React from 'react'
import RoomService from '../Services/RoomService.js'
import Modal from 'react-modal';
import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'
import QuestionService from '../Services/QuestionService.js';

const questionService = new QuestionService()

class RoomView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {roomDetails:props.info, questionList: []}
    console.log('roominfo', this.state.roomDetails)

    // if (localStorage.getItem('googleUser')) {
    //   roomService.getThem(JSON.parse(localStorage.getItem('googleUser')).user.id)
    // }
    // questionService.getThem(this.roomDbId)

    // questionService.on('got_questions', (questions) => {
    //     // console.log('questions', questions)
    //     // this.setState({questionList: questions})
    // })


  }





  // handleChange(event) {
  //   this.setState({position: event.target.value});
  // }



  render() {
    return (
      <div>

        <p>hello {this.state.roomDetails.job_position} </p>

      </div>

      )

  }

}





module.exports = RoomView
