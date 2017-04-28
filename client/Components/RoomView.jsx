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

    interviewService.getThem({roomid:this.state.roomDetails.id, owner_id:JSON.parse(localStorage.getItem('googleUser')).user.id})

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

        <div className="container intermediary-section">
          <h3 className="intermediary-header">{this.state.roomDetails.job_position}</h3>

          <section className="row">
            <div className="col s12 collection with-header">
              <div className="row">
                <div className="collection-header white-text blue-grey darken-1"><strong>Questions / Prompts</strong></div>
              </div>
              <div className="row">
                <div className="col s10 left">
                  <input id="newQuestion" value={this.state.newQuestion} placeholder="Type in new question..." onChange={this.handleChange.bind(this)}/>
                </div>
                <div className="col s2 right">
                  <a className="waves-effect waves-light btn blue darken-3 right" onClick={this.addQuestion.bind(this)}><span className="glyphicons glyphicons-plus"></span></a>
                </div>
              </div>
              {
                this.state.questionList.map(function(q, key) {
                  return (<div className="row" key={key}><div className="col s12"><a className="collection-item" >{q.question}</a></div></div>)
                })
              }
            </div>
          </section>

          <section className="row">
            <div className="col s12 collection with-header">
              <div className="row">
                <div className="collection-header white-text blue-grey darken-1"><strong>Upcoming Interviews</strong></div>
              </div>
              {
                this.state.upcomingInterviews.map(function(interview, key) {
                  var interviewDate = interview.start.toString().slice(0, 10);
                  var interviewTime = interview.start.toString().slice(11, 16);
                  return (
                    <div className="collection-item" key={key}>
                      <div className="row">
                        <div className="col s3 m2"><span className="truncate">{interviewDate}</span></div>
                        <div className="col s2 m2"><span className="truncate">{interviewTime}</span></div>
                        <div className="col s3 m2"><span className="truncate">{interview.interviewee_name}</span></div>
                        <div className="col m4 hide-on-small-only"><span className="truncate">{interview.interviewee_email}</span></div>
                        <div className="col s1 right">
                          <Link to={{ pathname: '/interviewroom', state: interview.id + '$' + roomDatabaseId/*, query: {roomname: room.job_position + room.owner_id}*/ }} >
                            <span className="glyphicons glyphicons-exit rooms-section-icons"></span>
                          </Link>
                        </div>
                        <div className="col s1 right">
                          <a href={'https://drive.google.com/drive/folders/' + interview.drive_link}><span className="social social-google-drive rooms-section-icons"></span></a>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </section>

          <section className="row">
            <div className="col s12 collection with-header">
              <div className="row">
                <div className="collection-header white-text blue-grey darken-1"><strong>Past Interviews</strong></div>
              </div>
              {
                this.state.pastInterviews.map(function(interview, key) {
                  return (
                    <div className="collection-item container" key={key}>
                      <div className="row">
                        <div className="col s3">{interview.start}</div>
                        <div className="col s3">{interview.interviewee_name}</div>
                        <div className="col s3">{interview.interviewee_email}</div>
                        <div className="secondary-content">
                          <Link to={{ pathname: '/interviewroom', state: interview.id + '$' + roomDatabaseId/*, query: {roomname: room.job_position + room.owner_id}*/ }} className="right" >
                            <span className="glyphicons glyphicons-exit rooms-section-icons"></span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </section>

        </div>
      </div>

      )
  }
}







module.exports = RoomView
