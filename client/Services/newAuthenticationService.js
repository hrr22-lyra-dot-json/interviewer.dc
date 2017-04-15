import axios from 'axios';

module.exports = {
  loginner: function() {
    axios.get('/auth/google')
    .then(function (response) {
      console.log(reponse);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
}


