import { EventEmitter } from 'events'
import axios from 'axios'

export default class InterviewService extends EventEmitter {
  constructor() {
    super()
  }

  // addOne(question) {
  //   this.addAQuestion(question, this.getThem.bind(this))
  // }
  getThem(roomDbId) {
    this.getInterviews(roomDbId, this.gotInterviews.bind(this))
  }
  getOne(interviewId) {
    this.getInterview(interviewId, this.gotInterview.bind(this))

  }

  // addAQuestion(question, callback) {
  //   axios.post('/api/Interview', question//meeting_id:roomDbId, question: question
  //   )
  //   .then(function(response) {
  //     callback(question.meeting_id)
  //   })
  // }
  getInterview(id, callback){
    axios.get('/api/getInterview', {
      params:{
        id: id
      }
    }).then(function(response) {
      console.log('getinterviewres', response)
      callback(response)
    })
    .catch(function (error) {
      console.log('get interview error', error);
    });
  }

  getInterviews(roomDbId, callback) {
    var userid = JSON.parse(localStorage.getItem('googleUser')).user.id;
    axios.get('/api/Interviews', {
      params: {
        roomid: roomDbId,
        owner_id: userid
      }
    })
    .then(function(response) {
      callback(response.data)
    })
    .catch(function (error) {
      console.log('get interviews error', error);
    });
  }
  gotInterviews(interviews) {
    this.emit('got_interviews', interviews)
  }
  gotInterview(interview) {
    this.emit('got_interview', interview)
  }
}