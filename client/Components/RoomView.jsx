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
    this.state = {roomDetails:props.info, questionList: [] , interviews:[], newQuestion:'', upcomingInterviews:[], pastInterviews:[]}
    console.log('roominfo', this.state.roomDetails)
    this.roomSelect = props.roomSelect;
    interviewService.getThem(this.state.roomDetails.id)

    interviewService.on('got_interviews', (interviews) => {
      if (interviews) {

        var upcoming = interviews.filter(function(interview) {
          return (new Date(interview.start)).getTime() >= (new Date()).getTime()
        }).sort(function(a, b) {
          return (new Date(a.start)).getTime() - (new Date(b.start)).getTime()
        })

        console.log('upcoming', upcoming)

        var past = interviews.filter(function(interview) {
          return (new Date(interview.start)).getTime() <= (new Date()).getTime()
        })
        console.log('past', past)



        this.setState({interviews: interviews, upcomingInterviews: upcoming, pastInterviews:past })
      }
    })
    questionService.getThem(this.state.roomDetails.id)

    questionService.on('got_questions', (questions) => {
        console.log('questions', questions)
        this.setState({questionList: questions})
    })

  }

  addQuestion() {
    var question = this.state.newQuestion;
    questionService.addOne({meeting_id: this.state.roomDetails.id, question: question})
    this.setState({newQuestion:''})
  }





  handleChange(event) {
    this.setState({newQuestion: event.target.value});
  }
  goHome() {
    this.roomSelect(null)
  }



  render() {
    var roomDatabaseId = this.state.roomDetails.id
    return (
      <div>
        <p>Room for {this.state.roomDetails.job_position} job.</p>

        <div  onClick={this.goHome.bind(this)}>Home</div>

        <Link to={{ pathname: '/interviewee', state:this.state.roomDetails query: {interviewer: this.state.roomDetails.owner_id, job_position: this.state.roomDetails.job_position, roomDbId:this.state.roomDetails.id}/*, query: {roomname: room.job_position + room.owner_id}*/ }} className="secondary-content">
          <span className="glyphicons glyphicons-calendar rooms-section-icons"></span>
        </Link>



        <li>
                <div className="col s12 collection with-header">
                    <div className="collection-header white-text blue-grey darken-1"><strong>Questions / Prompts</strong></div>
                    <input id="newQuestion" value={this.state.newQuestion} placeholder="Type in new question..." onChange={this.handleChange.bind(this)}/>
                    <div  onClick={this.addQuestion.bind(this)}>Add Question</div>
                    {
                        this.state.questionList.map(function(q, key) {
                            return (<a className="collection-item" key={key} >{q.question}</a>)
                        })
                    }
                </div>
            </li>
            <li>
                <div className="col s12 collection with-header">
                    <div className="collection-header white-text blue-grey darken-1"><strong>Upcoming Interviews</strong></div>
                    {
                        this.state.upcomingInterviews.map(function(interview, key) {
                          console.log('interview', interview)
                            return (
                              <div className="collection-item" >

                              <a   >{interview.start}</a>
                                <a   >{interview.interviewee_name}</a>
                                <a   >{interview.interviewee_email}</a>
                                <a href={'https://drive.google.com/drive/folders/' + interview.drive_link}>Link to Google drive folder</a>
                                <Link to={{ pathname: '/interviewroom', state: interview.id + '$' + roomDatabaseId/*, query: {roomname: room.job_position + room.owner_id}*/ }} >
                                  <span className="glyphicons glyphicons-exit rooms-section-icons"></span>
                                </Link>

                              </div>)
                        })
                    }
                </div>
            </li>
             <li>
                <div className="col s12 collection with-header">
                    <div className="collection-header white-text blue-grey darken-1"><strong>Past Interviews</strong></div>
                    {
                        this.state.pastInterviews.map(function(interview, key) {
                            return (
                              <div className="collection-item" >

                              <a   >{interview.start}</a>
                                <a   >{interview.interviewee_name}</a>
                                <a   >{interview.interviewee_email}</a>
                                <Link to={{ pathname: '/interviewroom', state: interview.id + '$' + roomDatabaseId/*, query: {roomname: room.job_position + room.owner_id}*/ }} >
                                  <span className="glyphicons glyphicons-exit rooms-section-icons"></span>
                                </Link>

                              </div>)
                        })
                    }
                </div>
            </li>

      </div>

      )

  }

}





module.exports = RoomView
