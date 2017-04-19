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

  // addAQuestion(question, callback) {
  //   axios.post('/api/Interview', question//meeting_id:roomDbId, question: question
  //   )
  //   .then(function(response) {
  //     callback(question.meeting_id)
  //   })
  // }

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
  }
  gotInterviews(interviews) {
    this.emit('got_interviews', interviews)
  }
}