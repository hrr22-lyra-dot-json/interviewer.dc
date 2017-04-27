import axios from 'axios';

exports.uploadBlobToDrive = function(blob, info) { //info = object with properties:interviewee_name, folder_id both accessed from interviewService
  LoggedIn(uploadBlob, blob, info);
};

var LoggedIn = function(callback, callbackInput1, callbackInput2) {
  axios.get('/logged-in')
  .then(function(response) {
    if (response.data.user) {
      localStorage.setItem('googleUser', JSON.stringify(response.data.user));
    } else {
      localStorage.setItem('googleUser', JSON.stringify(response.data.user));
    }
  })
  .catch(function (error) {
    // console.log(error);
  });
};

var uploadBlob = function(blob, info) {
  var accessToken = JSON.parse(localStorage.getItem('googleUser')).token.token;
  var url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable" +'&access_token='+ accessToken;
  var headers = {'X-Upload-Content-Type': blob.type , 'X-Upload-Content-Length': blob.size, 'Content-Type': 'application/json; charset=UTF-8'
};
  var name = info.interviewee_name + '_interviewRecording';
  var parents = [info.folder_id];

  axios({
    method: 'post',
    url: url,
    headers: headers,
    data: {
      name: name,
      parents: parents
    }
  })
  .then(function(response) {
    if (response.status === 200) {
      var url = response.headers.location;
      var headers = {'Content-Type': blob.type , 'Content-Length': blob.size };
      axios({
        method: 'put',
        url: url,
        headers: headers,
        data: blob
      })
      .then(function(response) {
        // console.log('upload response', response);
      })
      .catch(function (error) {
        // console.log(error);
      });

    } else {
      // console.log('Error:', response.statusText);
    }
  })
  .catch(function (error) {
    // console.log(error);
  });
};

exports.makeFolder = function(name, parents) { //parents passed as an array of parent folder ID's
  var accessToken = JSON.parse(localStorage.getItem('googleUser')).token.token;
  var url = "https://www.googleapis.com/drive/v3/files" + "?access_token=" + accessToken;
  var headers = {'Content-Type': 'application/json; charset=UTF-8'};
  var data = {
    'name': 'name',
    'mimeType': 'application/vnd.google-apps.folder'
  };
  if (parents) {
    data.parents = parents;
  }
  axios({
    method: 'post',
    url: url,
    headers: headers,
    data: data
  })
  .then(function(response) {
    // console.log('makefolder response:', response);
  })
  .catch(function (error) {
    // console.log(error);
  });
};

exports.makeInterviewFolder = function(input) {//not in action
  axios.post('/api/addInterviewFolder', input)
  .then(function(response) {
    // console.log('interview folder made ', response)
  })
  .catch(function (error) {
    // console.log('makefoldererror', error);
  });
};
