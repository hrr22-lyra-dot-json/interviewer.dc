import React from 'react'
import RoomService from '../Services/RoomService.js'
import Modal from 'react-modal';
import { hashHistory, Router, Route, Link, IndexRedirect, Redirect, withRouter} from 'react-router'
import QuestionService from '../Services/QuestionService.js';
import InterviewService from '../Services/InterviewService.js';

const questionService = new QuestionService()
const interviewService = new InterviewService()

class RoomView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {roomDetails:props.info, questionList: [] , interviews:[]}
    console.log('roominfo', this.state.roomDetails)
    interviewService.getThem(this.state.roomDetails.id)
    interviewService.on('got_interviews', (interviews) => {
      if (interviews) {
        this.setState({interviews: interviews})
      }
    })
    questionService.getThem(this.state.roomDetails.id)

    questionService.on('got_questions', (questions) => {
        console.log('questions', questions)
         this.setState({questionList: questions})
    })


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

        <li>
                <div className="col s12 collection with-header">
                    <div className="collection-header white-text blue-grey darken-1"><strong>Questions / Prompts</strong></div>
                    {
                        this.state.questionList.map(function(q, key) {
                            return (<a className="collection-item" key={key} >{q.question}</a>)
                        })
                    }
                </div>
            </li>
            <li>
                <div className="col s12 collection with-header">
                    <div className="collection-header white-text blue-grey darken-1"><strong>Interviews</strong></div>
                    {
                        this.state.interviews.map(function(interview, key) {
                            return (<a className="collection-item" key={key} >{interview.interviewee_email}</a>)
                        })
                    }
                </div>
            </li>

      </div>

      )

  }

}





module.exports = RoomView
