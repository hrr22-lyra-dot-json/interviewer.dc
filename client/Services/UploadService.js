
import axios from 'axios'

exports.uploadAudio = function(blob) {
//     //include Authorization: Bearer AbCdEf123456 header if accesstoken in url doesn't work const AuthStr = 'Bearer '.concat(USER_TOKEN);
// axios.get(URL, { headers: { Authorization: AuthStr } })
//  .then(response => {
  var accessToken = JSON.parse(localStorage.getItem('googleUser')).token.token

  var url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable" +'&access_token='+ accessToken;

  var headers = {'X-Upload-Content-Type': blob.type , 'X-Upload-Content-Length': blob.size, 'Content-Type': 'application/json; charset=UTF-8'
}

  axios({
    method: 'post',
    url: url,
    headers: headers,
    data:{
      name: 'audio'
    }
  })
  .then(function(response) {
    if (response.status === 200) {
      console.log('success! resumable session URI for upload:', response.headers.location)
      var url = response.headers.location;
      var headers = {'Content-Type': blob.type , 'Content-Length': blob.size }
      axios({
        method: 'put',
        url: url,
        headers: headers,
        data: blob
      })
      .then(function(response) {
        console.log('upload response', response)
      })
      .catch(function (error) {
        console.log(error);
      });

    } else {
      console.log('Error:', response.statusText)
    }
  })
  .catch(function (error) {
    console.log(error);
  });
};

exports.makeFolder = function(name, parents) { //parents passed as an array of parent folder ID's
  var accessToken = JSON.parse(localStorage.getItem('googleUser')).token.token
  var url = "https://www.googleapis.com/drive/v3/files" +"?access_token="+ accessToken;
  var headers = {'Content-Type': 'application/json; charset=UTF-8'};
  var data = {
    'name': 'name',
    'mimeType': 'application/vnd.google-apps.folder'
  }
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
    console.log('makefolder response:', response);
  })
  .catch(function (error) {
    console.log(error);
  });

}
  // req.body.interviewee
  // req.body.room_folder_id
  // req.body.interview_id
  // req.body.owner_id

  exports.makeInterviewFolder = function(input) {
    axios.post('/api/addInterviewFolder', input)
    .then(function(response) {
      console.log('interview folder made ', response)
    })
    .catch(function (error) {
      console.log('makefoldererror', error);
    });

  }


// var fileMetadata = {
//   'name' : 'Invoices',
//   'mimeType' : 'application/vnd.google-apps.folder'
// };
// drive.files.create({
//    resource: fileMetadata,
//    fields: 'id'
// }, function(err, file) {
//   if(err) {
//     // Handle error
//     console.log(err);
//   } else {
//     console.log('Folder Id: ', file.id);
//   }
// });
// POST
// https://www.googleapis.com/upload/drive/v3/files
// POST https://www.googleapis.com/drive/v3/files


// PUT https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&upload_id=xa298sd_sdlkj2 HTTP/1.1
// Content-Length: 2000000
// Content-Type: image/jpeg
// [BYTES 0-1999999]

// POST https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable
// X-Upload-Content-Type
// Content-Type//required if have metadata
// Content-Length

// POST https://www.googleapis.com/drive/v3/files?uploadType=resumable HTTP/1.1
// Authorization: Bearer [YOUR_AUTH_TOKEN]
// Content-Length: 38
// Content-Type: application/json; charset=UTF-8
// X-Upload-Content-Type: image/jpeg
// X-Upload-Content-Length: 2000000

// {
//   "name": "myObject"
// }