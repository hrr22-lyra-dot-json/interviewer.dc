import { EventEmitter } from 'events'
import axios from 'axios'

export default class QuestionService extends EventEmitter {
  constructor() {
    super()
  }

  addOne(question) {
    this.addAQuestion(question, this.getThem.bind(this))
  }
  getThem(roomDbId) {
    this.getQuestions(roomDbId, this.gotQuestions.bind(this))
  }

  addAQuestion(question, callback) {
    axios.post('/api/Question', question//meeting_id:roomDbId, question: question
    )
    .then(function(response) {
      callback(question.meeting_id)
    })
  }

  getQuestions(roomDbId, callback) {
    axios.get('/api/Questions', {
      params: {
        meeting_id: roomDbId
      }
    })
    .then(function(response) {
      callback(response.data)
    })
  }
  gotQuestions(questions) {
    this.emit('got_questions', questions)
  }
}
